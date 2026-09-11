import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    FEEDBACK_MAX_LENGTH,
    FEEDBACK_MESSAGE_TYPE,
} from 'src/shared/feedback';

const request = {
    type: FEEDBACK_MESSAGE_TYPE,
    kind: 'problem',
    message: '  Shorts are still visible.  ',
};
const fetchMock = vi.fn();
const addListener = vi.fn();

beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('VITE_POSTHOG_PROJECT_TOKEN', 'phc_test');
    vi.stubEnv('VITE_POSTHOG_HOST', 'https://eu.i.posthog.com');
    fetchMock
        .mockReset()
        .mockImplementation(async () => Response.json({ status: 'Ok' }));
    addListener.mockReset();
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('chrome', {
        runtime: {
            id: 'test-extension',
            getManifest: () => ({ version: '1.0.54' }),
            getURL: (path: string) =>
                `chrome-extension://test-extension/${path}`,
            onMessage: { addListener },
        },
    });
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.useRealTimers();
});

describe('manual feedback', () => {
    it('does not send anything on startup or listener registration', async () => {
        const { registerFeedbackListener } = await import('./feedback');
        registerFeedbackListener();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it.each([
        ['problem', 'problem_reported'],
        ['feature', 'feature_requested'],
    ])('sends %s with only the disclosed context', async (kind, event) => {
        const { sendFeedback } = await import('./feedback');
        expect(await sendFeedback({ ...request, kind })).toEqual({ ok: true });
        const [url, options] = fetchMock.mock.calls[0];
        expect(url).toBe('https://eu.i.posthog.com/i/v0/e/');
        expect(options.credentials).toBe('omit');
        expect(options.mode).toBe('cors');
        expect(JSON.parse(options.body)).toEqual({
            api_key: 'phc_test',
            event,
            distinct_id: expect.any(String),
            properties: {
                message: 'Shorts are still visible.',
                message_length: 25,
                feedback_type: kind,
                app: 'youtube-clean',
                app_version: '1.0.54',
                context: 'sidebar',
                $process_person_profile: false,
                $geoip_disable: true,
            },
        });
        await sendFeedback(request);
        expect(
            JSON.parse(fetchMock.mock.calls[1][1].body).distinct_id
        ).not.toBe(JSON.parse(options.body).distinct_id);
    });

    it.each([
        null,
        { ...request, type: 'another-message' },
        { ...request, kind: 'unknown' },
        { ...request, message: '   ' },
        { ...request, message: 42 },
        { ...request, message: 'a'.repeat(FEEDBACK_MAX_LENGTH + 1) },
    ])('rejects malformed reports before sending: %j', async (value) => {
        const { sendFeedback } = await import('./feedback');
        expect(await sendFeedback(value)).toEqual({
            ok: false,
            error: 'invalid',
        });
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('reports missing configuration without a network request', async () => {
        vi.stubEnv('VITE_POSTHOG_PROJECT_TOKEN', '');
        const { sendFeedback } = await import('./feedback');
        expect(await sendFeedback(request)).toEqual({
            ok: false,
            error: 'unavailable',
        });
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it.each([
        ['current capture response', '{"status":"Ok"}', 200],
        ['legacy capture response', '{"status":1}', 200],
        ['no-content acknowledgement', null, 204],
    ] as const)('accepts the %s', async (_name, body, status) => {
        fetchMock.mockResolvedValue(new Response(body, { status }));
        const { sendFeedback } = await import('./feedback');
        expect(await sendFeedback(request)).toEqual({ ok: true });
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it.each([
        { ok: false, json: async () => ({ status: 1 }) },
        { ok: true, json: async () => ({ status: 0 }) },
        { ok: true, json: async () => ({ status: 'Error' }) },
        { ok: true, json: async () => null },
        {
            ok: true,
            json: async () => {
                throw new Error('invalid JSON');
            },
        },
    ])(
        'does not claim success for a failed acknowledgement',
        async (response) => {
            fetchMock.mockResolvedValue(response);
            const { sendFeedback } = await import('./feedback');
            expect(await sendFeedback(request)).toEqual({
                ok: false,
                error: 'network',
            });
        }
    );

    it('handles offline failures', async () => {
        fetchMock.mockRejectedValue(new Error('offline'));
        const { sendFeedback } = await import('./feedback');
        expect(await sendFeedback(request)).toEqual({
            ok: false,
            error: 'network',
        });
    });

    it('aborts a stalled request after 15 seconds', async () => {
        vi.useFakeTimers();
        fetchMock.mockImplementation(
            (_url, options) =>
                new Promise((_resolve, reject) => {
                    options.signal.addEventListener('abort', () =>
                        reject(new Error('aborted'))
                    );
                })
        );
        const { sendFeedback } = await import('./feedback');
        const result = sendFeedback(request);
        await vi.advanceTimersByTimeAsync(15000);
        expect(await result).toEqual({ ok: false, error: 'network' });
        expect(vi.getTimerCount()).toBe(0);
    });

    it('accepts only sidebar messages and keeps the response channel open', async () => {
        const { registerFeedbackListener } = await import('./feedback');
        registerFeedbackListener();
        const listener = addListener.mock.calls[0][0];
        const response = vi.fn();
        expect(
            listener(
                request,
                { id: 'test-extension', url: 'https://www.youtube.com/' },
                response
            )
        ).toBeUndefined();
        expect(response).toHaveBeenCalledWith({ ok: false, error: 'invalid' });
        expect(fetchMock).not.toHaveBeenCalled();
        expect(
            listener(
                request,
                {
                    id: 'test-extension',
                    url: 'chrome-extension://test-extension/sidebar.html',
                },
                response
            )
        ).toBe(true);
        await vi.waitFor(() =>
            expect(response).toHaveBeenCalledWith({ ok: true })
        );
    });
});

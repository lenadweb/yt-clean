// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
let enableAutoSkipAds: typeof import('./ads').enableAutoSkipAds;
let disableAutoSkipAds: typeof import('./ads').disableAutoSkipAds;
import { observeElementChanges } from 'src/shared/utils/dom';
import {
    findNativeSkipButton,
    NATIVE_SKIP_MESSAGE,
    NATIVE_SKIP_RESET_MESSAGE,
} from 'src/shared/utils/nativeSkip';
import { version as buildVersion } from 'src/manifest.json';

vi.mock('src/shared/utils/dom', () => ({
    disconnectObserver: vi.fn(),
    observeElementChanges: vi.fn(),
}));
vi.mock('src/shared/utils/nativeSkip', () => ({
    findNativeSkipButton: vi.fn(),
    NATIVE_SKIP_MESSAGE: 'yt-clean-native-skip',
    NATIVE_SKIP_RESET_MESSAGE: 'yt-clean-native-skip-reset',
}));
const sendMessage = vi.fn();
const ready = { status: 'ready', version: buildVersion };
const check = () => {
    const calls = vi.mocked(observeElementChanges).mock.calls;
    calls[calls.length - 1]?.[2](document.documentElement);
};
const skipRequests = () =>
    sendMessage.mock.calls.filter(
        ([request]) => request.type === NATIVE_SKIP_MESSAGE
    );

beforeEach(async () => {
    vi.resetModules();
    ({ enableAutoSkipAds, disableAutoSkipAds } = await import('./ads'));
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.stubGlobal('chrome', {
        runtime: { sendMessage },
    });
    sendMessage.mockImplementation(async (request) =>
        request.type === NATIVE_SKIP_RESET_MESSAGE
            ? ready
            : { status: 'clicked' }
    );
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.mocked(findNativeSkipButton).mockReturnValue(
        document.createElement('button')
    );
});
afterEach(() => {
    disableAutoSkipAds();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

describe('browser-generated Skip requests', () => {
    it('can start when runtime.getManifest is unavailable but messaging works', async () => {
        vi.stubGlobal('chrome', { runtime: { sendMessage } });
        enableAutoSkipAds();
        check();
        await vi.advanceTimersByTimeAsync(0);
        expect(skipRequests()).toHaveLength(1);
        expect(
            document.documentElement.getAttribute('data-yt-clean-native-skip')
        ).toBe('browser-click-sent');
    });
    it('requests a browser click and never calls HTMLElement.click', async () => {
        const button = document.createElement('button');
        const click = vi.spyOn(button, 'click');
        vi.mocked(findNativeSkipButton).mockReturnValue(button);
        enableAutoSkipAds();
        check();
        await vi.advanceTimersByTimeAsync(0);
        expect(skipRequests()).toHaveLength(1);
        expect(click).not.toHaveBeenCalled();
        expect(
            document.documentElement.getAttribute('data-yt-clean-native-skip')
        ).toBe('browser-click-sent');
    });
    it('leaves unskippable ads alone', () => {
        vi.mocked(findNativeSkipButton).mockReturnValue(null);
        enableAutoSkipAds();
        check();
        expect(skipRequests()).toHaveLength(0);
    });
    it('does not send duplicate requests for every DOM mutation', async () => {
        enableAutoSkipAds();
        check();
        check();
        await vi.advanceTimersByTimeAsync(0);
        check();
        expect(skipRequests()).toHaveLength(1);
        await vi.advanceTimersByTimeAsync(1500);
        expect(skipRequests()).toHaveLength(2);
    });
    it('does not restart after disabling while a request is pending', async () => {
        let finish!: (value: { status: string }) => void;
        sendMessage.mockImplementation((request) =>
            request.type === NATIVE_SKIP_MESSAGE
                ? new Promise((resolve) => {
                      finish = resolve;
                  })
                : Promise.resolve(ready)
        );
        enableAutoSkipAds();
        check();
        await vi.advanceTimersByTimeAsync(0);
        disableAutoSkipAds();
        finish({ status: 'clicked' });
        await vi.advanceTimersByTimeAsync(3000);
        expect(skipRequests()).toHaveLength(1);
        expect(
            document.documentElement.getAttribute('data-yt-clean-native-skip')
        ).toBe('disabled');
    });
    it('stops retrying after the user cancels browser debugging', async () => {
        sendMessage.mockImplementation(async (request) =>
            request.type === NATIVE_SKIP_RESET_MESSAGE
                ? ready
                : { status: 'canceled' }
        );
        enableAutoSkipAds();
        check();
        await vi.advanceTimersByTimeAsync(5000);
        check();
        expect(skipRequests()).toHaveLength(1);
        enableAutoSkipAds();
        await vi.advanceTimersByTimeAsync(3000);
        expect(skipRequests()).toHaveLength(1);
        disableAutoSkipAds();
        enableAutoSkipAds();
        await vi.advanceTimersByTimeAsync(3000);
        expect(skipRequests()).toHaveLength(1);
    });
    it('keeps a canceled document paused when reconnecting', async () => {
        sendMessage.mockResolvedValue({
            status: 'canceled',
            version: buildVersion,
        });
        enableAutoSkipAds();
        await vi.advanceTimersByTimeAsync(3000);
        expect(skipRequests()).toHaveLength(0);
        expect(
            document.documentElement.getAttribute('data-yt-clean-native-skip')
        ).toBe('canceled');
        expect(
            document.documentElement.getAttribute(
                'data-yt-clean-native-skip-detail'
            )
        ).toBe('reload-to-resume');
    });
    it('reports a genuinely invalidated connection during startup', async () => {
        sendMessage.mockImplementation(() => {
            throw new Error('Extension context invalidated.');
        });
        expect(enableAutoSkipAds).not.toThrow();
        await vi.advanceTimersByTimeAsync(3000);
        expect(skipRequests()).toHaveLength(0);
        expect(
            document.documentElement.getAttribute('data-yt-clean-native-skip')
        ).toBe('reload-required');
        expect(
            document.documentElement.getAttribute(
                'data-yt-clean-native-skip-detail'
            )
        ).toBe('extension-context-invalidated');
        expect(
            document.documentElement.getAttribute('data-yt-clean-version')
        ).toBe(buildVersion);
    });
    it('stops polling if message delivery synchronously loses its context', async () => {
        sendMessage.mockImplementation((request) => {
            if (request.type === NATIVE_SKIP_RESET_MESSAGE)
                return Promise.resolve(ready);
            throw new Error('Extension context invalidated.');
        });
        enableAutoSkipAds();
        check();
        await vi.advanceTimersByTimeAsync(3000);
        expect(
            document.documentElement.getAttribute('data-yt-clean-native-skip')
        ).toBe('reload-required');
        expect(skipRequests()).toHaveLength(1);
    });
    it('distinguishes an unreachable worker from an invalidated page', async () => {
        sendMessage.mockRejectedValue(
            new Error(
                'Could not establish connection. Receiving end does not exist.'
            )
        );
        enableAutoSkipAds();
        await vi.advanceTimersByTimeAsync(3000);
        expect(skipRequests()).toHaveLength(0);
        expect(
            document.documentElement.getAttribute('data-yt-clean-native-skip')
        ).toBe('error');
        expect(
            document.documentElement.getAttribute(
                'data-yt-clean-native-skip-detail'
            )
        ).toBe('worker-unreachable');
    });
    it('does not click before the worker has confirmed the connection', async () => {
        let connect!: (value: typeof ready) => void;
        sendMessage.mockImplementation((request) =>
            request.type === NATIVE_SKIP_RESET_MESSAGE
                ? new Promise((resolve) => {
                      connect = resolve;
                  })
                : Promise.resolve({ status: 'clicked' })
        );
        enableAutoSkipAds();
        check();
        await vi.advanceTimersByTimeAsync(3000);
        expect(skipRequests()).toHaveLength(0);
        connect(ready);
        await vi.advanceTimersByTimeAsync(0);
        expect(skipRequests()).toHaveLength(1);
    });
    it('stops if the worker and page builds do not match', async () => {
        sendMessage.mockResolvedValue({
            status: 'ready',
            version: 'older-build',
        });
        enableAutoSkipAds();
        await vi.advanceTimersByTimeAsync(3000);
        expect(skipRequests()).toHaveLength(0);
        expect(
            document.documentElement.getAttribute(
                'data-yt-clean-native-skip-detail'
            )
        ).toBe('worker-version-mismatch');
    });
});

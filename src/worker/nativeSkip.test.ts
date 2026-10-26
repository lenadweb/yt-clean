import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { version as buildVersion } from 'src/manifest.json';

const url = 'https://www.youtube.com/watch?v=test';
const sender = {
    id: 'test-extension',
    frameId: 0,
    documentId: 'document-1',
    url,
    tab: { id: 7 },
} as chrome.runtime.MessageSender;
const getTargets = vi.fn();
const attach = vi.fn();
const detach = vi.fn();
const sendCommand = vi.fn();
const get = vi.fn();
const addMessageListener = vi.fn();
const addDetachListener = vi.fn();
let api: typeof import('./nativeSkip');

beforeEach(async () => {
    vi.resetModules();
    vi.resetAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(10000);
    getTargets.mockResolvedValue([
        { tabId: 7, type: 'page', attached: false, url },
    ]);
    attach.mockResolvedValue(undefined);
    detach.mockResolvedValue(undefined);
    get.mockResolvedValue({ isEnabled: true, autoSkipAds: { enabled: true } });
    sendCommand.mockImplementation(async (_target, method) =>
        method === 'Runtime.evaluate'
            ? { result: { value: { x: 160, y: 120, url } } }
            : {}
    );
    vi.stubGlobal('chrome', {
        runtime: {
            id: 'test-extension',
            onMessage: { addListener: addMessageListener },
        },
        storage: { local: { get } },
        debugger: {
            getTargets,
            attach,
            detach,
            sendCommand,
            onDetach: { addListener: addDetachListener },
        },
        tabs: { onRemoved: { addListener: vi.fn() } },
    });
    api = await import('./nativeSkip');
});
afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
});
const mouseCalls = () =>
    sendCommand.mock.calls.filter(
        ([, method]) => method === 'Input.dispatchMouseEvent'
    );

describe('YouTube-only native mouse input', () => {
    it('confirms its build without attaching or issuing mouse input', () => {
        api.registerNativeSkipListener();
        const reply = vi.fn();
        addMessageListener.mock.calls[0][0](
            { type: 'yt-clean-native-skip-reset' },
            sender,
            reply
        );
        expect(reply).toHaveBeenCalledWith({
            status: 'ready',
            version: buildVersion,
        });
        expect(attach).not.toHaveBeenCalled();
        expect(sendCommand).not.toHaveBeenCalled();
    });
    it('rejects a connection check from another origin', () => {
        api.registerNativeSkipListener();
        const reply = vi.fn();
        addMessageListener.mock.calls[0][0](
            { type: 'yt-clean-native-skip-reset' },
            { ...sender, url: 'https://example.com/' },
            reply
        );
        expect(reply).toHaveBeenCalledWith({
            status: 'unavailable',
            detail: 'invalid-sender',
        });
        expect(attach).not.toHaveBeenCalled();
    });
    it.each([
        { ...sender, id: 'other-extension' },
        { ...sender, frameId: 1 },
        {
            ...sender,
            url: 'https://www.youtube.com.attacker.test/watch?v=test',
        },
        { ...sender, url: 'https://example.com/watch?v=test' },
        { ...sender, tab: undefined },
    ])('rejects an invalid sender before attaching', async (value) => {
        expect(await api.clickNativeSkip(value)).toMatchObject({
            status: 'unavailable',
        });
        expect(attach).not.toHaveBeenCalled();
    });
    it('uses mouse press/release at the worker-verified point and detaches', async () => {
        expect(await api.clickNativeSkip(sender)).toMatchObject({
            status: 'clicked',
        });
        expect(mouseCalls().map(([, , params]) => params)).toEqual([
            {
                type: 'mousePressed',
                x: 160,
                y: 120,
                button: 'left',
                buttons: 1,
                clickCount: 1,
            },
            {
                type: 'mouseReleased',
                x: 160,
                y: 120,
                button: 'left',
                buttons: 0,
                clickCount: 1,
            },
        ]);
        expect(detach).toHaveBeenCalledWith({ tabId: 7 });
    });
    it('supports a watch page reached from the YouTube home document', async () => {
        getTargets.mockResolvedValue([
            { tabId: 7, attached: false, url: 'https://www.youtube.com/' },
        ]);
        expect(
            await api.clickNativeSkip({
                ...sender,
                url: 'https://www.youtube.com/',
            })
        ).toMatchObject({ status: 'clicked' });
        expect(mouseCalls()).toHaveLength(2);
    });
    it('does not click if the current document changes during the lookup', async () => {
        sendCommand
            .mockResolvedValueOnce({
                result: { value: { x: 160, y: 120, url } },
            })
            .mockResolvedValueOnce({
                result: {
                    value: {
                        x: 160,
                        y: 120,
                        url: 'https://www.youtube.com/watch?v=changed',
                    },
                },
            });
        expect(await api.clickNativeSkip(sender)).toMatchObject({
            status: 'unavailable',
            detail: 'page-changed',
        });
        expect(mouseCalls()).toHaveLength(0);
    });
    it('does not use a tab that navigated off YouTube', async () => {
        getTargets.mockResolvedValue([
            { tabId: 7, attached: false, url: 'https://example.com/' },
        ]);
        expect(await api.clickNativeSkip(sender)).toMatchObject({
            status: 'unavailable',
        });
        expect(attach).not.toHaveBeenCalled();
    });
    it('does not interfere with another debugger', async () => {
        getTargets.mockResolvedValue([{ tabId: 7, attached: true, url }]);
        expect(await api.clickNativeSkip(sender)).toMatchObject({
            status: 'busy',
        });
        expect(attach).not.toHaveBeenCalled();
        expect(detach).not.toHaveBeenCalled();
    });
    it('checks the current setting before attaching', async () => {
        get.mockResolvedValue({
            isEnabled: true,
            autoSkipAds: { enabled: false },
        });
        expect(await api.clickNativeSkip(sender)).toMatchObject({
            status: 'disabled',
        });
        expect(attach).not.toHaveBeenCalled();
    });
    it('checks again if the user disables the feature during lookup', async () => {
        get.mockResolvedValueOnce({
            isEnabled: true,
            autoSkipAds: { enabled: true },
        }).mockResolvedValueOnce({
            isEnabled: false,
            autoSkipAds: { enabled: true },
        });
        expect(await api.clickNativeSkip(sender)).toMatchObject({
            status: 'disabled',
        });
        expect(mouseCalls()).toHaveLength(0);
        expect(detach).toHaveBeenCalledOnce();
    });
    it.each([
        null,
        { x: -1, y: 5, url },
        { x: NaN, y: 5, url },
        { x: 10, y: 20, url: 'https://example.com/' },
    ])('does not click a missing or invalid point: %j', async (point) => {
        sendCommand.mockResolvedValue({ result: { value: point } });
        expect(await api.clickNativeSkip(sender)).toMatchObject({
            status: 'unavailable',
        });
        expect(mouseCalls()).toHaveLength(0);
        expect(detach).toHaveBeenCalledOnce();
    });
    it('cancels if the tab changes after the button check', async () => {
        getTargets
            .mockResolvedValueOnce([{ tabId: 7, attached: false, url }])
            .mockResolvedValueOnce([
                { tabId: 7, attached: true, url: 'https://example.com/' },
            ]);
        expect(await api.clickNativeSkip(sender)).toMatchObject({
            status: 'unavailable',
        });
        expect(mouseCalls()).toHaveLength(0);
    });
    it('detaches after a command failure', async () => {
        sendCommand.mockRejectedValue(new Error('target closed'));
        expect(await api.clickNativeSkip(sender)).toMatchObject({
            status: 'error',
        });
        expect(detach).toHaveBeenCalledOnce();
    });
    it('never detaches a debugger it failed to attach', async () => {
        attach.mockRejectedValue(new Error('another debugger'));
        expect(await api.clickNativeSkip(sender)).toMatchObject({
            status: 'busy',
        });
        expect(detach).not.toHaveBeenCalled();
    });
    it('honors cancellation and does not automatically reattach', async () => {
        api.registerNativeSkipListener();
        sendCommand.mockImplementation(async () => {
            addDetachListener.mock.calls[0][0](
                { tabId: 7 },
                'canceled_by_user'
            );
            return { result: { value: { x: 160, y: 120, url } } };
        });
        expect(await api.clickNativeSkip(sender)).toMatchObject({
            status: 'canceled',
        });
        vi.advanceTimersByTime(2000);
        expect(await api.clickNativeSkip(sender)).toMatchObject({
            status: 'canceled',
        });
        expect(attach).toHaveBeenCalledOnce();
        expect(mouseCalls()).toHaveLength(0);
        const reply = vi.fn();
        addMessageListener.mock.calls[0][0](
            { type: 'yt-clean-native-skip-reset' },
            { ...sender, url: 'https://www.youtube.com/watch?v=next' },
            reply
        );
        expect(reply).toHaveBeenCalledWith({
            status: 'canceled',
            version: buildVersion,
        });
        const freshReply = vi.fn();
        addMessageListener.mock.calls[0][0](
            { type: 'yt-clean-native-skip-reset' },
            { ...sender, documentId: 'document-2' },
            freshReply
        );
        expect(freshReply).toHaveBeenCalledWith({
            status: 'ready',
            version: buildVersion,
        });
    });
    it.each([
        [
            'Cannot access a chrome-extension:// URL of different extension',
            'extension-frame-conflict',
        ],
        ['Host access is restricted by policy.', 'browser-policy-blocked'],
    ])(
        'reports an attachment restriction without retrying a different target: %s',
        async (message, detail) => {
            attach.mockRejectedValue(new Error(message));
            expect(await api.clickNativeSkip(sender)).toMatchObject({
                status: 'error',
                detail,
            });
            expect(attach).toHaveBeenCalledOnce();
            expect(detach).not.toHaveBeenCalled();
            expect(mouseCalls()).toHaveLength(0);
        }
    );
    it('does not mistake its own debugger detach for a user cancellation', async () => {
        api.registerNativeSkipListener();
        detach.mockImplementation(async () => {
            addDetachListener.mock.calls[0][0](
                { tabId: 7 },
                'canceled_by_user'
            );
        });
        expect(await api.clickNativeSkip(sender)).toMatchObject({
            status: 'clicked',
        });
        vi.advanceTimersByTime(2000);
        expect(await api.clickNativeSkip(sender)).toMatchObject({
            status: 'clicked',
        });
    });
    it('does not accept mouse coordinates or code supplied in a message', async () => {
        api.registerNativeSkipListener();
        const reply = vi.fn();
        addMessageListener.mock.calls[0][0](
            {
                type: 'yt-clean-native-skip',
                x: 999,
                expression: 'injected-code',
            },
            sender,
            reply
        );
        await vi.advanceTimersByTimeAsync(0);
        expect(mouseCalls()[0][2].x).toBe(160);
        expect(sendCommand.mock.calls[0][2].expression).not.toContain(
            'injected-code'
        );
    });
});

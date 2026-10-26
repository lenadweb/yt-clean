import {
    findNativeSkipButton,
    NATIVE_SKIP_MESSAGE,
    NATIVE_SKIP_RESET_MESSAGE,
    NativeSkipResult,
} from 'src/shared/utils/nativeSkip';
import { version as buildVersion } from 'src/manifest.json';

interface SkipPoint {
    x: number;
    y: number;
    url: string;
}
const busyTabs = new Set<number>();
const attachedTabs = new Set<number>();
const attachedDocuments = new Map<number, string>();
const detachingTabs = new Set<number>();
const canceledDocuments = new Map<number, string>();
const documentKey = (sender: chrome.runtime.MessageSender): string =>
    sender.documentId ?? 'unknown-document';
const lastAttempt = new Map<number, number>();

const isYouTubeOrigin = (value: string | undefined): boolean => {
    try {
        return new URL(value ?? '').origin === 'https://www.youtube.com';
    } catch {
        return false;
    }
};

const isWatchUrl = (value: string | undefined): boolean => {
    try {
        const url = new URL(value ?? '');
        return (
            url.origin === 'https://www.youtube.com' &&
            url.pathname === '/watch' &&
            Boolean(url.searchParams.get('v'))
        );
    } catch {
        return false;
    }
};
const validSender = (sender: chrome.runtime.MessageSender): boolean =>
    sender.id === chrome.runtime.id &&
    sender.frameId === 0 &&
    Number.isInteger(sender.tab?.id) &&
    isYouTubeOrigin(sender.url);
const featureEnabled = async (): Promise<boolean> => {
    const settings = await chrome.storage.local.get([
        'isEnabled',
        'autoSkipAds',
    ]);
    const skip = settings.autoSkipAds;
    return (
        settings.isEnabled === true &&
        typeof skip === 'object' &&
        skip !== null &&
        'enabled' in skip &&
        skip.enabled === true
    );
};

export const clickNativeSkip = async (
    sender: chrome.runtime.MessageSender
): Promise<NativeSkipResult> => {
    if (!validSender(sender))
        return { status: 'unavailable', detail: 'invalid-sender' };
    const tabId = sender.tab!.id!;
    if (canceledDocuments.has(tabId)) return { status: 'canceled' };
    if (busyTabs.has(tabId))
        return { status: 'busy', detail: 'request-in-progress' };
    const previousAttempt = lastAttempt.get(tabId);
    if (previousAttempt !== undefined && Date.now() - previousAttempt < 1000)
        return { status: 'busy', detail: 'retry-cooldown' };
    busyTabs.add(tabId);
    const target = { tabId };
    let attached = false;
    let stage = 'read-settings';
    try {
        if (!(await featureEnabled())) return { status: 'disabled' };
        stage = 'list-targets';
        const page = (await chrome.debugger.getTargets()).find(
            (entry) => entry.tabId === tabId
        );
        if (!page || !isYouTubeOrigin(page.url))
            return { status: 'unavailable', detail: 'no-watch-target' };
        if (page.attached)
            return { status: 'busy', detail: 'debugger-already-attached' };
        lastAttempt.set(tabId, Date.now());
        stage = 'debugger-attach';
        await chrome.debugger.attach(target, '1.3');
        attached = true;
        attachedTabs.add(tabId);
        attachedDocuments.set(tabId, documentKey(sender));
        stage = 'page-lookup';
        // Fixed extension code; sender messages cannot supply expressions or coordinates.
        const expression = `(() => {
            if (location.origin !== 'https://www.youtube.com' || location.pathname !== '/watch') return null;
            const button = (${findNativeSkipButton.toString()})();
            if (!button) return null;
            const rect = button.getBoundingClientRect();
            return {x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, url: location.href};
        })()`;
        const evaluated = (await chrome.debugger.sendCommand(
            target,
            'Runtime.evaluate',
            { expression, returnByValue: true }
        )) as {
            result?: { value?: Partial<SkipPoint> };
            exceptionDetails?: unknown;
        };
        const point = evaluated?.result?.value;
        if (
            evaluated?.exceptionDetails ||
            !point ||
            typeof point.x !== 'number' ||
            typeof point.y !== 'number' ||
            !Number.isFinite(point.x) ||
            !Number.isFinite(point.y) ||
            point.x < 0 ||
            point.y < 0 ||
            !isWatchUrl(point.url)
        )
            return {
                status: 'unavailable',
                detail: evaluated?.exceptionDetails
                    ? 'page-lookup-error'
                    : 'no-skip-point',
            };
        const currentPage = (await chrome.debugger.getTargets()).find(
            (entry) => entry.tabId === tabId
        );
        if (!currentPage || !isYouTubeOrigin(currentPage.url))
            return { status: 'unavailable', detail: 'page-changed' };
        // Sender/target metadata can retain a URL from before SPA navigation.
        // The current document and hit-tested point are authoritative instead.
        const rechecked = (await chrome.debugger.sendCommand(
            target,
            'Runtime.evaluate',
            { expression, returnByValue: true }
        )) as {
            result?: { value?: Partial<SkipPoint> };
            exceptionDetails?: unknown;
        };
        const currentPoint = rechecked?.result?.value;
        if (
            rechecked?.exceptionDetails ||
            !currentPoint ||
            currentPoint.url !== point.url ||
            currentPoint.x !== point.x ||
            currentPoint.y !== point.y
        )
            return { status: 'unavailable', detail: 'page-changed' };
        if (!(await featureEnabled())) return { status: 'disabled' };
        if (canceledDocuments.has(tabId)) return { status: 'canceled' };
        stage = 'browser-input';
        await chrome.debugger.sendCommand(target, 'Input.dispatchMouseEvent', {
            type: 'mousePressed',
            x: point.x,
            y: point.y,
            button: 'left',
            buttons: 1,
            clickCount: 1,
        });
        await chrome.debugger.sendCommand(target, 'Input.dispatchMouseEvent', {
            type: 'mouseReleased',
            x: point.x,
            y: point.y,
            button: 'left',
            buttons: 0,
            clickCount: 1,
        });
        return { status: 'clicked' };
    } catch (error) {
        const message = String(error);
        const detail = /Cannot access a chrome-extension:\/\/ URL/i.test(
            message
        )
            ? 'extension-frame-conflict'
            : /restricted by policy/i.test(message)
              ? 'browser-policy-blocked'
              : /another debugger|already attached/i.test(message)
                ? 'debugger-already-attached'
                : `${stage}-failed`;
        return {
            status: canceledDocuments.has(tabId)
                ? 'canceled'
                : detail === 'debugger-already-attached'
                  ? 'busy'
                  : 'error',
            detail,
        };
    } finally {
        if (attached) {
            detachingTabs.add(tabId);
            await chrome.debugger.detach(target).catch(() => {});
            detachingTabs.delete(tabId);
            attachedTabs.delete(tabId);
            attachedDocuments.delete(tabId);
        }
        busyTabs.delete(tabId);
    }
};

export const registerNativeSkipListener = (): void => {
    chrome.runtime.onMessage.addListener((request, sender, respond) => {
        if (request?.type === NATIVE_SKIP_RESET_MESSAGE) {
            if (!validSender(sender)) {
                respond({
                    status: 'unavailable',
                    detail: 'invalid-sender',
                } satisfies NativeSkipResult);
                return;
            }
            const tabId = sender.tab!.id!;
            // A same-document navigation or feature rerun must not undo the
            // user's cancellation of Chrome's debugging notification.
            if (canceledDocuments.get(tabId) === documentKey(sender)) {
                respond({
                    status: 'canceled',
                    version: buildVersion,
                } satisfies NativeSkipResult);
                return;
            }
            canceledDocuments.delete(tabId);
            respond({
                status: 'ready',
                version: buildVersion,
            } satisfies NativeSkipResult);
            return;
        }
        if (request?.type !== NATIVE_SKIP_MESSAGE) return;
        void clickNativeSkip(sender).then(respond);
        return true;
    });
    chrome.debugger?.onDetach.addListener((source, reason) => {
        const tabId = source.tabId;
        if (
            tabId !== undefined &&
            reason === 'canceled_by_user' &&
            attachedTabs.has(tabId) &&
            !detachingTabs.has(tabId)
        )
            canceledDocuments.set(
                tabId,
                attachedDocuments.get(tabId) ?? 'unknown-document'
            );
    });
    chrome.tabs.onRemoved.addListener((tabId) => {
        lastAttempt.delete(tabId);
        canceledDocuments.delete(tabId);
        attachedDocuments.delete(tabId);
    });
};

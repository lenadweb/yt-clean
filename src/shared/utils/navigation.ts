type UrlListener = (url: string) => void;

const YT_NAVIGATE_EVENT = 'yt-navigate-finish';

const listeners = new Set<UrlListener>();
let currentUrl = window.location.href;
let observer: MutationObserver | null = null;
let started = false;

const notify = (): void => {
    if (window.location.href === currentUrl) return;

    currentUrl = window.location.href;
    listeners.forEach((listener) => listener(currentUrl));
};

const stopFallbackObserver = (): void => {
    observer?.disconnect();
    observer = null;
};

const onNavigateFinish = (): void => {
    stopFallbackObserver();
    notify();
};

const startFallbackObserver = (): void => {
    if (observer) return;

    observer = new MutationObserver(notify);

    const observe = () => {
        if (document.body) {
            observer?.observe(document.body, {
                childList: true,
                subtree: true,
            });
        }
    };

    if (document.body) {
        observe();
    } else {
        document.addEventListener('DOMContentLoaded', observe, { once: true });
    }
};

const startTracking = (): void => {
    if (started) return;
    started = true;

    document.addEventListener(YT_NAVIGATE_EVENT, onNavigateFinish);
    startFallbackObserver();
};

export const getCurrentUrl = (): string => currentUrl;

export const onUrlChange = (listener: UrlListener): (() => void) => {
    listeners.add(listener);
    startTracking();

    return () => {
        listeners.delete(listener);
    };
};

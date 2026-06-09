type UrlListener = (url: string) => void;

const listeners = new Set<UrlListener>();
let currentUrl = window.location.href;
let observer: MutationObserver | null = null;

const notify = (): void => {
    if (window.location.href === currentUrl) return;

    currentUrl = window.location.href;
    listeners.forEach((listener) => listener(currentUrl));
};

const startObserving = (): void => {
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

export const getCurrentUrl = (): string => currentUrl;

export const onUrlChange = (listener: UrlListener): (() => void) => {
    listeners.add(listener);
    startObserving();

    return () => {
        listeners.delete(listener);
    };
};

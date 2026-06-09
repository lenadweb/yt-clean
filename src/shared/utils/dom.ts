export const waitForElement = (
    selector: string,
    maxTimeout = 0,
    signal?: AbortSignal,
    root: HTMLElement | Document = document.documentElement
): Promise<Element | null> =>
    new Promise((resolve) => {
        const check = () => root.querySelector(selector);

        const existing = check();
        if (existing) return resolve(existing);
        if (signal?.aborted) return resolve(null);

        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        let throttleId: ReturnType<typeof setTimeout> | null = null;

        const cleanup = () => {
            observer.disconnect();
            signal?.removeEventListener('abort', onAbort);
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            if (throttleId) {
                clearTimeout(throttleId);
                throttleId = null;
            }
        };

        const onAbort = () => {
            cleanup();
            resolve(null);
        };

        const throttledCheck = () => {
            if (throttleId !== null) return;

            throttleId = setTimeout(() => {
                throttleId = null;
                const element = check();
                if (element) {
                    cleanup();
                    resolve(element);
                }
            }, 200);
        };

        const observer = new MutationObserver(() => {
            throttledCheck();
        });

        observer.observe(root, {
            childList: true,
            subtree: true,
        });

        signal?.addEventListener('abort', onAbort, { once: true });

        if (maxTimeout > 0) {
            timeoutId = setTimeout(() => {
                cleanup();
                resolve(null);
            }, maxTimeout);
        }
    });

type ObserverCallback = (element: Element) => void;

interface ObserverRegistry {
    [id: string]: MutationObserver;
}

declare global {
    interface Window {
        __elementObservers__?: ObserverRegistry;
    }
}

export const observeElementChanges = (
    id: string,
    selector: string,
    callback: ObserverCallback,
    options: MutationObserverInit = {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
    },
    root: Element = document.documentElement
) => {
    if (!window.__elementObservers__) {
        window.__elementObservers__ = {};
    }

    disconnectObserver(id);

    const checkAndCallback = () => {
        const element = document.querySelector(selector);
        if (element) callback(element);
    };

    checkAndCallback();

    const observer = new MutationObserver(() => {
        checkAndCallback();
    });

    observer.observe(root, options);

    window.__elementObservers__[id] = observer;
};

export const disconnectObserver = (id: string): void => {
    const observer = window.__elementObservers__?.[id];
    if (observer) {
        observer.disconnect();
        delete window.__elementObservers__![id];
    }
};

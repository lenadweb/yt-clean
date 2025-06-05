export const waitForElement = (
    selector: string,
    maxTimeout = 0,
    root: HTMLElement | Document = document.documentElement
): Promise<Element | null> =>
    new Promise((resolve) => {
        const check = () => {
            console.log(`check ${selector}`);
            return root.querySelector(selector);
        };

        const existing = check();
        if (existing) return resolve(existing);

        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        let throttleId: ReturnType<typeof setTimeout> | null = null;

        const cleanup = () => {
            observer.disconnect();
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            if (throttleId) {
                clearTimeout(throttleId);
                throttleId = null;
            }
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

    if (window.__elementObservers__[id]) {
        window.__elementObservers__[id].disconnect();
        delete window.__elementObservers__[id];
    }

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

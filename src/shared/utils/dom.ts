export const waitForElement = (
    selector: string,
    maxTimeout = 0,
    root = document.documentElement
): Promise<Element | null> =>
    new Promise((resolve) => {
        const existing = document.querySelector(selector);
        if (existing) return resolve(existing);

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                if (timeoutId) clearTimeout(timeoutId);
                resolve(element);
            }
        });

        observer.observe(root, {
            childList: true,
            subtree: true,
        });

        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        if (maxTimeout > 0) {
            timeoutId = setTimeout(() => {
                observer.disconnect();
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

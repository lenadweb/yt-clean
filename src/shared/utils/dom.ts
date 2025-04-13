export const waitForElement = (selector: string): Promise<Element> =>
    new Promise((resolve) => {
        const existing = document.querySelector(selector);
        if (existing) return resolve(existing);

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });
    });

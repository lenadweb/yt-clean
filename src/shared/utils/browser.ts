export const isOpera = () => typeof (globalThis as any)?.opr !== 'undefined';

export const waitForDocumentReady = (): Promise<void> =>
    new Promise((resolve) => {
        if (document.readyState === 'complete') {
            resolve();
        } else {
            window.addEventListener('load', () => resolve(), { once: true });
        }
    });

export const clickElement = (selector: string) =>
    (document.querySelector(selector) as HTMLButtonElement)?.click();

export const hideElement = (selector: string) => {
    const el = document.querySelector(selector) as HTMLElement;
    if (el) {
        el.style.setProperty('opacity', '0', 'important');
    }
};

export const showElement = (selector: string) => {
    const el = document.querySelector(selector) as HTMLElement;
    if (el) {
        el.style.removeProperty('opacity');
    }
};

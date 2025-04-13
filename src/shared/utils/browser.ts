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

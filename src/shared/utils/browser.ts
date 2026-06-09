interface OperaGlobal {
    opr?: unknown;
}

export const isOpera = () =>
    typeof (globalThis as OperaGlobal).opr !== 'undefined';

export const waitForDocumentReady = (): Promise<void> =>
    new Promise((resolve) => {
        if (document.readyState === 'complete') {
            resolve();
        } else {
            window.addEventListener('load', () => resolve(), { once: true });
        }
    });

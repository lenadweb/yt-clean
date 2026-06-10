import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { waitForElement } from 'src/shared/utils/dom';
import { StorageProvider } from 'src/shared/hooks/useStorage';
import { getAttr } from 'src/shared/utils/getAttr';

const ROOT_ID = getAttr('root');
const FONT_STYLE_ID = getAttr('font-style');

const injectFontFace = (): void => {
    if (document.getElementById(FONT_STYLE_ID)) return;

    const globalFontStyle = document.createElement('style');
    globalFontStyle.id = FONT_STYLE_ID;
    globalFontStyle.textContent = `
      @font-face {
        font-family: 'Manrope';
        src: url(chrome-extension://${chrome.runtime.id}/fonts/Manrope-VariableFont_wght.ttf) format('truetype');
        font-weight: 100 900;
        font-style: normal;
      }
    `;
    document.head.appendChild(globalFontStyle);
};

const createRootElement = (): HTMLElement => {
    const existingRoot = document.getElementById(ROOT_ID);
    if (existingRoot) return existingRoot;

    const root = document.createElement('div');
    root.id = ROOT_ID;
    document.body.appendChild(root);

    return root;
};

export const injectComponents = () => {
    waitForElement('body').then(() => {
        const root = createRootElement();
        injectFontFace();

        ReactDOM.createRoot(root).render(
            <StorageProvider>
                <App />
            </StorageProvider>
        );
    });
};

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { waitForElement } from 'src/shared/utils/dom';
import { StorageProvider } from 'src/shared/hooks/useStorage';

export const injectComponents = () => {
    waitForElement('body').then(() => {
        const root = document.createElement('div');
        root.id = 'root';
        document.body.appendChild(root);
        const globalFontStyle = document.createElement('style');
        globalFontStyle.textContent = `
          @font-face {
            font-family: 'Manrope';
            src: url(chrome-extension://${chrome.runtime.id}/fonts/Manrope-VariableFont_wght.ttf) format('truetype');
            font-weight: 100 900;
            font-style: normal;
          }
        `;
        document.head.appendChild(globalFontStyle);

        ReactDOM.createRoot(root).render(
            <StorageProvider>
                <App />
            </StorageProvider>
        );
    });
};

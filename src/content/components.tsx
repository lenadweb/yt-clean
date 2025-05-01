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

        ReactDOM.createRoot(root).render(
            <StorageProvider>
                <App />
            </StorageProvider>
        );
    });
};

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from 'src/content/App';
import { CONFIG } from 'src/shared/config';
import { StorageProvider } from 'src/shared/hooks/useStorage';

async function main() {
    const injection = document.createElement('div');
    document.querySelector('html')?.appendChild(injection);
    ReactDOM.createRoot(injection).render(
        <StorageProvider>
            <App {...CONFIG} />
        </StorageProvider>
    );
}

main()
    .then()
    .catch((e) => console.log(e));

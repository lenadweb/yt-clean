import React from 'react';
import ReactDOM from 'react-dom/client';
import Blocked from 'src/blocked/components/Blocked';
import '@assets/styles/index.css';
import { StorageProvider } from 'src/shared/hooks/useStorage';

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

ReactDOM.createRoot(root).render(
    <StorageProvider>
        <Blocked />
    </StorageProvider>
);

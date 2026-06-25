import React from 'react';
import { StorageProvider } from 'src/shared/hooks/useStorage';
import Settings from 'src/sidebar/components/Settings';
import { ToastProvider } from 'src/sidebar/components/Toast';

const App = () => (
    <StorageProvider>
        <ToastProvider>
            <Settings />
        </ToastProvider>
    </StorageProvider>
);

export default App;

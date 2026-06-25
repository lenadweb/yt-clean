import React from 'react';
import { StorageProvider } from 'src/shared/hooks/useStorage';
import Settings from 'src/sidebar/components/Settings';
import { ExperimentalModalProvider } from 'src/sidebar/components/ExperimentalModal';

const App = () => (
    <StorageProvider>
        <ExperimentalModalProvider>
            <Settings />
        </ExperimentalModalProvider>
    </StorageProvider>
);

export default App;

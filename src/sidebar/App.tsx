import React from 'react';
import { StorageProvider } from 'src/shared/hooks/useStorage';
import Settings from 'src/sidebar/components/Settings';
import { ExperimentalModalProvider } from 'src/sidebar/components/ExperimentalModal';
import { PresetWarningModalProvider } from 'src/sidebar/components/PresetWarningModal';

const App = () => (
    <StorageProvider>
        <ExperimentalModalProvider>
            <PresetWarningModalProvider>
                <Settings />
            </PresetWarningModalProvider>
        </ExperimentalModalProvider>
    </StorageProvider>
);

export default App;

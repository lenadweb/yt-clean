import React from 'react';
import { StorageProvider } from 'src/shared/hooks/useStorage';
import Settings from 'src/sidebar/components/Settings';

const App = () => (
    <StorageProvider>
        <Settings />
    </StorageProvider>
);

export default App;

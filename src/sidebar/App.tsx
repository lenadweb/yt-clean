import React from 'react';
import { StorageProvider } from 'src/shared/hooks/useStorage';
import Settings from 'src/sidebar/components/Settings';
import { ExperimentalModalProvider } from 'src/sidebar/components/ExperimentalModal';
import { PresetWarningModalProvider } from 'src/sidebar/components/PresetWarningModal';
import type { StorageState } from 'src/shared/storage/config';
import { LocaleMessages, setI18nMockMessages } from 'src/shared/utils/i18n';

export type SidebarMock = {
    settings?: StorageState;
    shortcut?: string;
    hideShortcut?: boolean;
    hideFooter?: boolean;
    messages?: LocaleMessages;
};

type Props = {
    mock?: SidebarMock;
};

const App = ({ mock }: Props) => {
    setI18nMockMessages(mock?.messages);

    return (
        <StorageProvider mockSettings={mock?.settings}>
            <ExperimentalModalProvider>
                <PresetWarningModalProvider>
                    <Settings mock={mock} />
                </PresetWarningModalProvider>
            </ExperimentalModalProvider>
        </StorageProvider>
    );
};

export default App;

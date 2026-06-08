import React, { FC, useCallback, useMemo } from 'react';
import { useStorage } from 'src/shared/hooks/useStorage';
import { CONFIG } from 'src/shared/config';
import { IStorage } from 'src/shared/storage/config';
import { SettingsAccordion } from 'src/sidebar/components/SettingsAccordion';
import { IAllSetting } from 'src/shared/types/settings';
import { t } from 'src/shared/utils/i18n';
import Logo from 'src/assets/icons/logo.svg';
import PowerOnIcon from 'src/assets/icons/power-on.svg';
import PowerOffIcon from 'src/assets/icons/power-off.svg';

const Settings: FC = () => {
    const [settings, updateSettings] = useStorage();

    const setSetting = (key: keyof IStorage, value: IAllSetting) => {
        updateSettings(key, value);
    };

    const setEnabled = useCallback((value: boolean) => {
        updateSettings('isEnabled', value);
    }, []);

    const isEnabled = settings.isEnabled;

    const SettingsComponents = useMemo(
        () =>
            [...CONFIG.domActions].map((value, index) => (
                <SettingsAccordion
                    enabled={isEnabled}
                    key={index}
                    defaultOpen={index === 0}
                    title={value.title}
                    settings={value.settings}
                    storageSettings={settings}
                    setSetting={setSetting}
                />
            )),
        [settings, isEnabled]
    );

    return (
        <div className="min-h-screen w-full space-y-2.5 rounded-2xl bg-background p-3 pt-5 text-white shadow-xl">
            <div className="mb-[26px] ml-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Logo className="size-8" />
                    <h1 className="flex items-center gap-2 text-[20px] font-medium">
                        {t('YouTube Clean')}
                    </h1>
                </div>
                <button
                    onClick={() => setEnabled(!isEnabled)}
                    className="flex items-center justify-center transition duration-150 focus:outline-none active:scale-95"
                    aria-label={t('Toggle extension')}
                >
                    {isEnabled ? <PowerOnIcon /> : <PowerOffIcon />}
                </button>
            </div>
            {SettingsComponents}
        </div>
    );
};

export default Settings;

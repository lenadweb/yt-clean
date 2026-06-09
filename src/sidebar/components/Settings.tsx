import React, { FC } from 'react';
import { useStorage } from 'src/shared/hooks/useStorage';
import { getSettingsCategories } from 'src/shared/featureConfig';
import { IStorage } from 'src/shared/storage/config';
import { SettingsAccordion } from 'src/sidebar/components/SettingsAccordion';
import { IAllSetting } from 'src/shared/types/settings';
import { t } from 'src/shared/utils/i18n';
import Logo from 'src/assets/icons/logo.svg';
import PowerOnIcon from 'src/assets/icons/power-on.svg';
import PowerOffIcon from 'src/assets/icons/power-off.svg';

const settingsCategories = getSettingsCategories();

const Settings: FC = () => {
    const [settings, updateSettings] = useStorage();

    const isEnabled = settings.isEnabled;
    const setSetting = (key: keyof IStorage, value: IAllSetting) => {
        updateSettings(key, value);
    };
    const toggleEnabled = () => {
        updateSettings('isEnabled', !isEnabled);
    };

    return (
        <div className="min-h-screen w-full space-y-2.5 rounded-2xl bg-background p-3 pt-5 text-white shadow-xl">
            <div className="mb-[26px] ml-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Logo className="size-8" />
                    <h1 className="flex items-center gap-2 text-[20px] font-medium">
                        {t('youtube_clean')}
                    </h1>
                </div>
                <button
                    onClick={toggleEnabled}
                    className="flex items-center justify-center transition duration-150 focus:outline-none active:scale-95"
                    aria-label={t('toggle_extension')}
                >
                    {isEnabled ? <PowerOnIcon /> : <PowerOffIcon />}
                </button>
            </div>
            {settingsCategories.map((category, index) => (
                <SettingsAccordion
                    enabled={isEnabled}
                    key={category.title}
                    defaultOpen={index === 0}
                    title={category.title}
                    settings={category.settings}
                    storageSettings={settings}
                    setSetting={setSetting}
                />
            ))}
        </div>
    );
};

export default Settings;

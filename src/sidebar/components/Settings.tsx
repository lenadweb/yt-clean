import React, { FC, useCallback, useMemo } from 'react';
import { useStorage } from 'src/shared/hooks/useStorage';
import { CONFIG } from 'src/shared/config';
import { IStorage } from 'src/shared/storage/config';
import { SettingsAccordion } from 'src/sidebar/components/SettingsAccordion';
import logo from 'src/assets/icons/128.png';
import Switch from 'src/sidebar/components/Switch';
import { IAllSetting } from 'src/shared/types/settings';

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
                    title={value.title}
                    settings={value.settings}
                    storageSettings={settings}
                    setSetting={setSetting}
                />
            )),
        [settings, isEnabled]
    );

    return (
        <div className="min-h-screen w-full space-y-4 rounded-2xl bg-[#1c1c1e] p-5 text-white shadow-xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img className="size-8" src={logo} />
                    <h1 className="flex items-center gap-2 text-md font-medium">
                        Clean YouTube
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <div className="min-w-8 text-right text-sm uppercase">
                        {isEnabled ? 'on' : 'off'}
                    </div>
                    <Switch enabled={isEnabled} setEnabled={setEnabled} />
                </div>
            </div>
            {SettingsComponents}
        </div>
    );
};

export default Settings;

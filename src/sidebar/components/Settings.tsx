import React, { FC, useMemo } from 'react';
import { useStorage } from 'src/shared/hooks/useStorage';
import { CONFIG } from 'src/shared/config';
import { IStorage } from 'src/shared/storage/config';
import { SettingsAccordion } from 'src/sidebar/components/SettingsAccordion';
import logo from 'src/assets/icons/128.png';

const Settings: FC = () => {
    const [settings, updateSettings] = useStorage();

    const setSetting = (key: keyof IStorage, value: boolean) => {
        updateSettings(key, { enabled: value });
    };

    const SettingsComponents = useMemo(
        () =>
            [...CONFIG.domActions].map((value, index) => (
                <SettingsAccordion
                    key={index}
                    title={value.title}
                    settings={value.settings}
                    storageSettings={settings}
                    setSetting={setSetting}
                />
            )),
        [settings]
    );

    return (
        <div className="min-h-screen w-full space-y-4 rounded-2xl bg-[#1c1c1e] p-5 text-white shadow-xl">
            <img className="size-8" src={logo} />
            <h1 className="flex items-center gap-2 text-xl font-bold">
                Clean YouTube
            </h1>
            <p className="text-sm text-black-200">
                Select the elements you want to hide
            </p>
            {SettingsComponents}
        </div>
    );
};

export default Settings;

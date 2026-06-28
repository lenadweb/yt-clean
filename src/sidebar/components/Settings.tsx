import React, { FC } from 'react';
import { useStorage } from 'src/shared/hooks/useStorage';
import { CATEGORIES } from 'src/shared/featureConfig';
import { SettingsAccordion } from 'src/sidebar/components/SettingsAccordion';
import PresetTags from 'src/sidebar/components/PresetTags';
import ResetPresetLink from 'src/sidebar/components/ResetPresetLink';
import { t } from 'src/shared/utils/i18n';
import Logo from 'src/assets/icons/logo.svg';
import PowerOnIcon from 'src/assets/icons/power-on.svg';
import PowerOffIcon from 'src/assets/icons/power-off.svg';
import GithubIcon from 'src/assets/icons/github.svg';

const GITHUB_URL = 'https://github.com/lenadweb/yt-clean';

const Settings: FC = () => {
    const [settings, updateSettings] = useStorage();

    const isEnabled = settings.isEnabled;
    const toggleEnabled = () => {
        updateSettings('isEnabled', !isEnabled);
    };

    return (
        <div className="flex min-h-screen w-full flex-col rounded-2xl bg-background p-3 pt-5 text-white shadow-xl">
            <div className="mb-[26px] ml-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Logo className="size-8" />
                    <h1 className="flex items-center gap-2 text-[20px] font-medium">
                        {t('youtube_clean')}
                    </h1>
                </div>
                <button
                    onClick={toggleEnabled}
                    className="flex cursor-pointer items-center justify-center transition duration-150 focus:outline-none active:scale-95"
                    aria-label={t('toggle_extension')}
                >
                    {isEnabled ? <PowerOnIcon /> : <PowerOffIcon />}
                </button>
            </div>
            <PresetTags />
            <div className="space-y-2.5">
                {CATEGORIES.map((category, index) => (
                    <SettingsAccordion
                        key={category.title}
                        defaultOpen={index === 0}
                        title={category.title}
                        sections={category.sections}
                    />
                ))}
            </div>
            <ResetPresetLink />
            <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-auto flex items-center justify-center gap-1.5 pt-6 pb-2 text-sm text-white/60 transition hover:text-white"
            >
                <GithubIcon className="size-4" />
                {t('view_on_github')}
            </a>
        </div>
    );
};

export default Settings;

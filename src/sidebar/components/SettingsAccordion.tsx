import React, { FC } from 'react';
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from '@headlessui/react';
import { StorageState } from 'src/shared/storage/config';
import ChevronDownIcon from 'src/assets/icons/chevron-down.svg';
import cn from 'classnames';
import { SettingsSection } from 'src/shared/types/config';
import SettingsGroup from 'src/sidebar/components/SettingsGroup';
import { SettingValue } from 'src/shared/types/settings';
import { t } from 'src/shared/utils/i18n';

type Props = {
    title: string;
    settings: SettingsSection[];
    storageSettings: StorageState;
    enabled: boolean;
    setSetting: (key: keyof StorageState, value: SettingValue) => void;
    defaultOpen?: boolean;
};

export const SettingsAccordion: FC<Props> = ({
    title,
    storageSettings,
    enabled,
    settings,
    defaultOpen,
    setSetting,
}) => (
    <Disclosure defaultOpen={defaultOpen}>
        {({ open }) => (
            <>
                <div
                    className={cn(
                        'rounded-3xl bg-black-700 transition-colors',
                        {
                            'text-white-100': enabled,
                            'text-[#51515C]': !enabled,
                        }
                    )}
                >
                    <div className="flex items-center justify-between">
                        <DisclosureButton className="flex w-full items-center justify-between gap-2 p-5">
                            <div className="text-base leading-[1.2]">
                                {t(title)}
                            </div>
                            <ChevronDownIcon
                                className={cn(
                                    'w-5 transition',
                                    !open && '-rotate-90 opacity-65',
                                    open && '-rotate-180'
                                )}
                            />
                        </DisclosureButton>
                    </div>

                    <DisclosurePanel
                        transition
                        className="origin-top space-y-2 px-6 pb-5 pt-1 transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
                    >
                        {settings.map((setting, i) => (
                            <SettingsGroup
                                isFirst={i === 0}
                                enabled={enabled}
                                key={i}
                                isNew={!!setting.isNew}
                                settings={storageSettings}
                                withoutCheckboxes={!!setting.withoutCheckboxes}
                                withoutSwitch={!!setting.withoutSwitch}
                                groups={setting.groups}
                                setSetting={setSetting}
                                title={setting.title}
                            />
                        ))}
                    </DisclosurePanel>
                </div>
            </>
        )}
    </Disclosure>
);

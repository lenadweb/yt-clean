import React, { FC } from 'react';
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Switch,
} from '@headlessui/react';
import { IStorage } from 'src/shared/storage/config';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import cn from 'classnames';
import { IAttrAction, IDomActions } from 'src/shared/types/config';
import SettingsGroup from 'src/sidebar/components/SettingsGroup';
import { IAllSetting } from 'src/shared/types/settings';

type Props = {
    title: string;
    settings: IDomActions<IAttrAction[]>[];
    storageSettings: IStorage;
    enabled: boolean;
    setSetting: (key: keyof IStorage, value: IAllSetting) => void;
};

export const SettingsAccordion: FC<Props> = ({
    title,
    storageSettings,
    enabled,
    settings,
    setSetting,
}) => (
    <Disclosure>
        {({ open }) => (
            <>
                <div className="rounded-3xl bg-black-700 text-white-100">
                    <div className="flex items-center justify-between">
                        <DisclosureButton className="flex w-full items-center justify-between gap-2 px-6 py-5">
                            <div className="text-base leading-[1.2]">
                                {title}
                            </div>
                            <ChevronDownIcon
                                className={cn(
                                    'w-5 transition',
                                    !open && '-rotate-90'
                                )}
                            />
                        </DisclosureButton>
                    </div>

                    <DisclosurePanel
                        transition
                        className="origin-top space-y-2 px-6 pb-5 transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
                    >
                        {settings.map((setting, i) => (
                            <SettingsGroup
                                isFirst={i === 0}
                                enabled={enabled}
                                key={i}
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

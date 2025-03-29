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

type Props = {
    title: string;
    settings: IDomActions<IAttrAction[]>[];
    storageSettings: IStorage;
    setSetting: (key: keyof IStorage, value: boolean) => void;
};

export const SettingsAccordion: FC<Props> = ({
    title,
    storageSettings,
    settings,
    setSetting,
}) => (
    <Disclosure>
        {({ open }) => (
            <>
                <div className="rounded-3xl bg-black-700 px-6 py-5 text-white-100">
                    <div className="flex items-center justify-between">
                        <DisclosureButton className="flex w-full items-center justify-between gap-2">
                            <div className="line text-base leading-[1.2]">
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
                        className="mt-3 origin-top space-y-2 transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
                    >
                        {settings.map((setting, i) => (
                            <SettingsGroup
                                key={i}
                                settings={storageSettings}
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

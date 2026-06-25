import React, { FC } from 'react';
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from '@headlessui/react';
import ChevronDownIcon from 'src/assets/icons/chevron-down.svg';
import cn from 'classnames';
import { I18nKey, SettingsSection } from 'src/shared/types/config';
import SettingsGroup from 'src/sidebar/components/SettingsGroup';
import { useStorage } from 'src/shared/hooks/useStorage';
import { t } from 'src/shared/utils/i18n';

type Props = {
    title: I18nKey;
    sections: SettingsSection[];
    defaultOpen?: boolean;
};

export const SettingsAccordion: FC<Props> = ({
    title,
    sections,
    defaultOpen,
}) => {
    const [settings] = useStorage();
    const enabled = settings.isEnabled;

    return (
        <Disclosure defaultOpen={defaultOpen}>
            {({ open }) => (
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
                        {sections.map((section, i) => (
                            <SettingsGroup
                                isFirst={i === 0}
                                key={section.title}
                                isNew={!!section.isNew}
                                isExperimental={!!section.isExperimental}
                                controls={section.controls}
                                features={section.features}
                                title={section.title}
                            />
                        ))}
                    </DisclosurePanel>
                </div>
            )}
        </Disclosure>
    );
};

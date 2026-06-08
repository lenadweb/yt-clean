import React, { FC, Fragment } from 'react';
import cn from 'classnames';
import { Checkbox } from 'src/sidebar/components/Checkbox';
import { IFeatureConfig } from 'src/shared/types/config';
import { IStorage } from 'src/shared/storage/config';
import Divider from 'src/sidebar/components/Divider';
import Switch from 'src/sidebar/components/Switch';
import { IAllSetting } from 'src/shared/types/settings';
import { NewBadge } from 'src/sidebar/components/NewBadge';
import { t } from 'src/shared/utils/i18n';

interface ISettingsGroup {
    title: string;
    isFirst: boolean;
    enabled: boolean;
    isNew?: boolean;
    groups: IFeatureConfig[];
    withoutCheckboxes: boolean;
    withoutSwitch: boolean;
    settings: IStorage;
    setSetting: (key: keyof IStorage, value: IAllSetting) => void;
}

const SettingsGroup: FC<ISettingsGroup> = ({
    groups,
    isFirst,
    enabled,
    isNew,
    withoutCheckboxes,
    withoutSwitch,
    settings,
    setSetting,
    title,
}) => {
    const groupEnabled = groups.some(
        (value) => value.storageKey && settings[value.storageKey]?.enabled
    );

    const toggleGroup = (value: boolean) => {
        groups.forEach((item) => {
            if (!item.storageKey) return;
            const oldValue = settings[item.storageKey];
            setSetting(item.storageKey, {
                ...(oldValue || {}),
                enabled: value,
            });
        });
    };
    return (
        <div className="last:!mb-2">
            {!isFirst && <Divider />}
            <div className="mb-4 flex items-center justify-between">
                <div
                    className={cn(
                        'mr-auto flex items-center gap-2 text-sm leading-[1.2] transition-colors',
                        {
                            'text-white-100': enabled,
                            'text-[#51515C]': !enabled,
                        }
                    )}
                >
                    {t(title)}
                    {isNew && <NewBadge />}
                </div>
                {!withoutSwitch ? (
                    <Switch
                        disabled={!enabled}
                        enabled={groupEnabled}
                        setEnabled={toggleGroup}
                    />
                ) : null}
            </div>
            {!withoutCheckboxes ? (
                <div className="ml-3 flex flex-col gap-3">
                    {groups.map((group, index) => (
                        <Fragment
                            key={
                                group.storageKey ||
                                group.title ||
                                `group-${index}`
                            }
                        >
                            <Checkbox
                                isGrey={!groupEnabled}
                                isNew={group.isNew}
                                label={t(group.title || '')}
                                checked={
                                    settings[group.storageKey]?.enabled ?? false
                                }
                                disabled={!enabled}
                                onChange={(value) =>
                                    setSetting(group.storageKey, {
                                        enabled: value,
                                    })
                                }
                            />
                        </Fragment>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default SettingsGroup;

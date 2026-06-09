import React, { FC } from 'react';
import cn from 'classnames';
import { Checkbox } from 'src/sidebar/components/Checkbox';
import { INormalizedFeature } from 'src/shared/types/config';
import { IStorage } from 'src/shared/storage/config';
import Divider from 'src/sidebar/components/Divider';
import Switch from 'src/sidebar/components/Switch';
import { IAllSetting } from 'src/shared/types/settings';
import { NewBadge } from 'src/sidebar/components/NewBadge';
import { t } from 'src/shared/utils/i18n';

interface ISettingsGroup {
    titleKey: string;
    isFirst: boolean;
    enabled: boolean;
    isNew?: boolean;
    groups: INormalizedFeature[];
    withoutCheckboxes: boolean;
    withoutSwitch: boolean;
    settings: IStorage;
    setSetting: (key: keyof IStorage, value: IAllSetting) => void;
}

const isGroupEnabled = (
    groups: INormalizedFeature[],
    settings: IStorage
): boolean => groups.some(({ id }) => Boolean(settings[id]?.enabled));

const SettingsGroup: FC<ISettingsGroup> = ({
    groups,
    isFirst,
    enabled,
    isNew,
    withoutCheckboxes,
    withoutSwitch,
    settings,
    setSetting,
    titleKey,
}) => {
    const groupEnabled = isGroupEnabled(groups, settings);

    const setGroupEnabled = (value: boolean) => {
        groups.forEach((item) => {
            setSetting(item.id, {
                ...settings[item.id],
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
                    {t(titleKey)}
                    {isNew && <NewBadge />}
                </div>
                {!withoutSwitch ? (
                    <Switch
                        disabled={!enabled}
                        enabled={groupEnabled}
                        setEnabled={setGroupEnabled}
                    />
                ) : null}
            </div>
            {!withoutCheckboxes ? (
                <div className="ml-3 flex flex-col gap-3">
                    {groups.map((group) => (
                        <Checkbox
                            key={group.id}
                            isGrey={!groupEnabled}
                            isNew={group.isNew}
                            label={t(group.titleKey || '')}
                            checked={settings[group.id]?.enabled ?? false}
                            disabled={!enabled}
                            onChange={(value) =>
                                setSetting(group.id, {
                                    enabled: value,
                                })
                            }
                        />
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default SettingsGroup;

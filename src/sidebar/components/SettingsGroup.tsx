import React, { FC } from 'react';
import cn from 'classnames';
import { Checkbox } from 'src/sidebar/components/Checkbox';
import { Feature } from 'src/shared/types/config';
import { StorageState } from 'src/shared/storage/config';
import Divider from 'src/sidebar/components/Divider';
import Switch from 'src/sidebar/components/Switch';
import { SettingValue } from 'src/shared/types/settings';
import { NewBadge } from 'src/sidebar/components/NewBadge';
import { t } from 'src/shared/utils/i18n';

interface SettingsGroupProps {
    title: string;
    isFirst: boolean;
    enabled: boolean;
    isNew?: boolean;
    groups: Feature[];
    withoutCheckboxes: boolean;
    withoutSwitch: boolean;
    settings: StorageState;
    setSetting: (key: keyof StorageState, value: SettingValue) => void;
}

const isGroupEnabled = (groups: Feature[], settings: StorageState): boolean =>
    groups.some(({ id }) => Boolean(settings[id]?.enabled));

const SettingsGroup: FC<SettingsGroupProps> = ({
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
                    {t(title)}
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
                            label={t(group.title || '')}
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

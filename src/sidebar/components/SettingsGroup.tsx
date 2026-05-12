import React, { FC, Fragment } from 'react';
import { Checkbox } from 'src/sidebar/components/Checkbox';
import {
    ElementActions,
    IAttrAction,
    IDomActions,
    SettingsGroup as ISettingsGroupConfig,
} from 'src/shared/types/config';
import { IStorage } from 'src/shared/storage/config';
import Divider from 'src/sidebar/components/Divider';
import Switch from 'src/sidebar/components/Switch';
import { Dropdown } from 'src/sidebar/components/Dropdown';
import { IAllSetting, IDropdownSettings } from 'src/shared/types/settings';
import { Subtitle } from 'src/sidebar/components/Subtitle';

interface ISettingsGroup {
    title: string;
    isFirst: boolean;
    enabled: boolean;
    groups: Array<ISettingsGroupConfig<IAttrAction[]>>;
    withoutCheckboxes: boolean;
    withoutSwitch: boolean;
    settings: IStorage;
    setSetting: (key: keyof IStorage, value: IAllSetting) => void;
}

const SettingsGroup: FC<ISettingsGroup> = ({
    groups,
    isFirst,
    enabled,
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
            <Divider className={`${isFirst ? 'mt-0' : ''}`} />
            <div className="mb-4 flex items-center justify-between">
                <div className="mr-auto text-sm leading-[1.2] text-white-100">
                    {title}
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
                            {'type' in group && group.type === 'dropdown' ? (
                                <Dropdown
                                    label={group.title || ''}
                                    value={
                                        (
                                            settings[
                                                group.storageKey
                                            ] as IDropdownSettings
                                        ).value
                                    }
                                    options={group.options || []}
                                    disabled={!enabled || !groupEnabled}
                                    onChange={(value) => {
                                        setSetting(group.storageKey, {
                                            enabled: true,
                                            value,
                                        });
                                    }}
                                />
                            ) : 'type' in group &&
                              group.type === 'subtitle' &&
                              group.subtitle ? (
                                <Subtitle
                                    label={group.title || ''}
                                    value={group.subtitle(
                                        settings[
                                            group.storageKey
                                        ] as IDropdownSettings
                                    )}
                                />
                            ) : (
                                <Checkbox
                                    isGrey={!groupEnabled}
                                    label={group.title || ''}
                                    checked={
                                        settings[group.storageKey]?.enabled ??
                                        false
                                    }
                                    disabled={!enabled}
                                    onChange={(value) =>
                                        setSetting(group.storageKey, {
                                            enabled: value,
                                        })
                                    }
                                />
                            )}
                        </Fragment>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default SettingsGroup;

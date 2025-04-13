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
import cn from 'classnames';
import Switch from 'src/sidebar/components/Switch';
import isEnabled = chrome.action.isEnabled;
import { Dropdown } from 'src/sidebar/components/Dropdown';
import { IAllSetting, IDropdownSettings } from 'src/shared/types/settings';

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
        (value) => settings[value.storageKey]?.enabled
    );

    const toggleGroup = (value: boolean) => {
        groups.forEach((item) => {
            const oldValue = settings[item.storageKey];
            console.log(oldValue);
            setSetting(item.storageKey, {
                ...(oldValue || {}),
                enabled: value,
            });
        });
    };
    console.log(settings['persistentPlaybackSpeed']);
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
                    {groups.map((group) =>
                        group.type === 'dropdown' ? (
                            <Dropdown
                                key={group.title}
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
                                    console.log(value);
                                    setSetting(group.storageKey, {
                                        enabled: true,
                                        value,
                                    });
                                }}
                            />
                        ) : (
                            <Checkbox
                                isGrey={!groupEnabled}
                                key={group.title}
                                label={group.title || ''}
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
                        )
                    )}
                </div>
            ) : null}
        </div>
    );
};

export default SettingsGroup;

import React, { FC, Fragment } from 'react';
import { Checkbox } from 'src/sidebar/components/Checkbox';
import {
    IAttrAction,
    IDomActions,
    SettingsGroup as ISettingsGroupConfig,
} from 'src/shared/types/config';
import { IStorage } from 'src/shared/storage/config';
import { Switch } from '@headlessui/react';
import Divider from 'src/sidebar/components/Divider';
import cn from 'classnames';

interface ISettingsGroup {
    title: string;
    groups: Array<ISettingsGroupConfig<IAttrAction[]>>;
    settings: IStorage;
    setSetting: (key: keyof IStorage, value: boolean) => void;
}

const SettingsGroup: FC<ISettingsGroup> = ({
    groups,
    settings,
    setSetting,
    title,
}) => {
    const groupEnabled = groups.some(
        (value) => settings[value.storageKey]?.enabled
    );

    console.log(groups);

    const toggleGroup = (value: boolean) => {
        groups.forEach((item) => {
            setSetting(item.storageKey, value);
        });
    };
    return (
        <div>
            <Divider />
            <div className="mb-4 flex items-center justify-between">
                <div className="text-sm leading-[1.2] text-white-100">
                    {title}
                </div>
                <Switch
                    checked={groupEnabled}
                    onChange={toggleGroup}
                    className={`${
                        groupEnabled ? 'bg-red-accent' : 'bg-black-600'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition`}
                >
                    <span
                        className={`${
                            groupEnabled ? 'translate-x-6' : 'translate-x-1'
                        } inline-block size-4 rounded-full bg-white-100 transition`}
                    />
                </Switch>
            </div>
            <div className="ml-3">
                {groups.map((group) => (
                    <Checkbox
                        key={group.title}
                        label={group.title || ''}
                        checked={settings[group.storageKey]?.enabled ?? false}
                        onChange={(value) =>
                            setSetting(group.storageKey, value)
                        }
                    />
                ))}
            </div>
        </div>
    );
};

export default SettingsGroup;

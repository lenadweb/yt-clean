import { useEffect, useState } from 'react';
import {
    IAttrAction,
    IConfig,
    IDomActions,
    ISettingsBlock,
    SettingsGroup,
} from 'src/shared/types/config';
import { IAllSetting, IBaseSetting } from 'src/shared/types/settings';
import { useStorage } from 'src/shared/hooks/useStorage';

export type IAttrActionWithStatus = {
    status: IAllSetting;
    action: IAttrAction[];
    group: SettingsGroup<null>;
};

export const useActions = ({ domActions }: IConfig) => {
    const [settings] = useStorage();
    const [enabledActions, setEnabledActions] = useState<
        IAttrActionWithStatus[]
    >([]);

    useEffect(() => {
        if (!settings) return;
        const isEnabled = settings.isEnabled;

        const collectActions = (
            blocks?: IDomActions<IAttrAction[]>[]
        ): SettingsGroup<IAttrAction[]>[] => {
            if (!blocks) return [];
            return blocks.flatMap((block) => block.groups || []);
        };

        const extractEnabledActions = (
            groups: SettingsGroup<IAttrAction[]>[]
        ): IAttrActionWithStatus[] =>
            groups.reduce<IAttrActionWithStatus[]>((acc, group) => {
                const setting = settings[group.storageKey];
                acc.push({
                    status: {
                        enabled: !isEnabled ? false : !!setting?.enabled,
                        value: (setting as any)?.value,
                    },
                    action: group.actions,
                    group: {
                        ...group,
                        actions: null,
                    },
                });
                return acc;
            }, []);
        const domGroups = collectActions(
            domActions.flatMap((action) => action.settings || [])
        );
        const result = extractEnabledActions([...domGroups]);

        setEnabledActions(result);
    }, [settings, domActions]);

    return enabledActions;
};

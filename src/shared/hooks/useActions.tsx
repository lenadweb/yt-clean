import { useEffect, useState } from 'react';
import {
    IAttrAction,
    IConfig,
    IDomActions,
    ISettingsBlock,
    SettingsGroup,
} from 'src/shared/types/config';
import { IBaseSetting } from 'src/shared/types/settings';
import { useStorage } from 'src/shared/hooks/useStorage';

export type IAttrActionWithStatus = {
    status: IBaseSetting;
    action: IAttrAction[];
};

export const useActions = ({ domActions }: IConfig) => {
    const [settings] = useStorage();
    const [enabledActions, setEnabledActions] = useState<
        IAttrActionWithStatus[]
    >([]);

    useEffect(() => {
        if (!settings) return;

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
                const setting = (settings as any)[group.storageKey];
                if (setting?.enabled) {
                    acc.push({ status: setting, action: group.actions });
                }
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

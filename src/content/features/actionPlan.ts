import {
    IAttrAction,
    IConfig,
    IDomActions,
    ISettingsBlock,
    SettingsGroup,
} from 'src/shared/types/config';
import { IStorage } from 'src/shared/storage/config';
import { ISettings } from 'src/shared/types/settings';
import { FeatureActionPlan, StorageChanges } from 'src/content/features/types';

const hasActions = (
    group: SettingsGroup<IAttrAction[]>
): group is SettingsGroup<IAttrAction[]> & { actions: IAttrAction[] } =>
    'actions' in group;

const hasStorageChange = (
    changes: StorageChanges | undefined,
    storageKey: keyof ISettings
): boolean =>
    !changes ||
    Boolean(changes[storageKey as keyof IStorage] || changes.isEnabled);

const getSettingValue = (
    settings: IStorage,
    storageKey: keyof ISettings
): unknown => {
    const setting = settings[storageKey] as { value?: unknown } | undefined;

    return setting?.value;
};

const isSettingEnabled = (
    settings: IStorage,
    storageKey: keyof ISettings
): boolean => Boolean(settings.isEnabled && settings[storageKey]?.enabled);

const getSettingsGroups = (
    sections: IDomActions<IAttrAction[]>[]
): SettingsGroup<IAttrAction[]>[] =>
    sections.flatMap((section) => section.groups);

const getConfigSections = (
    config: IConfig
): ISettingsBlock<IAttrAction[]>['settings'] =>
    config.domActions.flatMap((block) => block.settings);

const buildGroupActionPlans = (
    groups: SettingsGroup<IAttrAction[]>[],
    settings: IStorage,
    changes?: StorageChanges
): FeatureActionPlan[] =>
    groups
        .filter(hasActions)
        .filter(({ storageKey }) => hasStorageChange(changes, storageKey))
        .map((group) => ({
            status: {
                enabled: isSettingEnabled(settings, group.storageKey),
                value: getSettingValue(settings, group.storageKey),
            },
            actions: group.actions,
            group,
        }));

const isSectionChanged = (
    section: IDomActions<IAttrAction[]>,
    changes?: StorageChanges
): boolean =>
    !changes ||
    Boolean(changes.isEnabled) ||
    section.groups.some(
        ({ storageKey }) => changes[storageKey as keyof IStorage]
    );

const areAllSectionGroupsEnabled = (
    section: IDomActions<IAttrAction[]>,
    settings: IStorage
): boolean =>
    Boolean(
        settings.isEnabled &&
            section.groups.every(
                ({ storageKey }) => settings[storageKey]?.enabled
            )
    );

const buildFullGroupActionPlans = (
    sections: IDomActions<IAttrAction[]>[],
    settings: IStorage,
    changes?: StorageChanges
): FeatureActionPlan[] =>
    sections
        .filter((section) => Boolean(section.onFullGroupEnabledActions))
        .filter((section) => isSectionChanged(section, changes))
        .map((section) => ({
            status: {
                enabled: areAllSectionGroupsEnabled(section, settings),
                value: null,
            },
            actions: section.onFullGroupEnabledActions || [],
            group: null,
        }));

export const buildFeatureActionPlans = (
    config: IConfig,
    settings: IStorage,
    changes?: StorageChanges
): FeatureActionPlan[] => {
    const sections = getConfigSections(config);
    const groups = getSettingsGroups(sections);

    return [
        ...buildGroupActionPlans(groups, settings, changes),
        ...buildFullGroupActionPlans(sections, settings, changes),
    ];
};

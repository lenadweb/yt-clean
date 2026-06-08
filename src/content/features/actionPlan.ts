import { IConfig, INormalizedFeature } from 'src/shared/types/config';
import { IStorage } from 'src/shared/storage/config';
import { ISettings } from 'src/shared/types/settings';
import { FeatureActionPlan, StorageChanges } from 'src/content/features/types';

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

const getSectionKey = (feature: INormalizedFeature): string =>
    `${feature.category}::${feature.section}`;

const getSections = (features: INormalizedFeature[]): INormalizedFeature[][] =>
    features.reduce<INormalizedFeature[][]>((sections, feature) => {
        const section = sections.find(
            ([item]) => getSectionKey(item) === getSectionKey(feature)
        );

        if (section) {
            section.push(feature);
            return sections;
        }

        sections.push([feature]);
        return sections;
    }, []);

const buildFeaturePlans = (
    features: INormalizedFeature[],
    settings: IStorage,
    changes?: StorageChanges
): FeatureActionPlan[] =>
    features
        .filter(({ storageKey }) => hasStorageChange(changes, storageKey))
        .map((feature) => ({
            status: {
                enabled: isSettingEnabled(settings, feature.storageKey),
                value: getSettingValue(settings, feature.storageKey),
            },
            actions: feature.actions,
            feature,
        }));

const isSectionChanged = (
    features: INormalizedFeature[],
    changes?: StorageChanges
): boolean =>
    !changes ||
    Boolean(changes.isEnabled) ||
    features.some(({ storageKey }) => changes[storageKey as keyof IStorage]);

const areAllSectionFeaturesEnabled = (
    features: INormalizedFeature[],
    settings: IStorage
): boolean =>
    Boolean(
        settings.isEnabled &&
            features.every(({ storageKey }) => settings[storageKey]?.enabled)
    );

const getSectionActions = (features: INormalizedFeature[]) =>
    features.flatMap((feature) => feature.ui?.onFullGroupEnabledActions || []);

const buildSectionPlans = (
    features: INormalizedFeature[],
    settings: IStorage,
    changes?: StorageChanges
): FeatureActionPlan[] =>
    getSections(features)
        .filter((section) => getSectionActions(section).length > 0)
        .filter((section) => isSectionChanged(section, changes))
        .map((section) => ({
            status: {
                enabled: areAllSectionFeaturesEnabled(section, settings),
                value: null,
            },
            actions: getSectionActions(section),
            feature: null,
        }));

export const buildFeatureActionPlans = (
    config: IConfig,
    settings: IStorage,
    changes?: StorageChanges
): FeatureActionPlan[] => [
    ...buildFeaturePlans(config.features, settings, changes),
    ...buildSectionPlans(config.features, settings, changes),
];

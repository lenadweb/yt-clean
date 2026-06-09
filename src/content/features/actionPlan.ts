import { INormalizedFeature } from 'src/shared/types/config';
import { IStorage } from 'src/shared/storage/config';
import { ISettings } from 'src/shared/types/settings';
import { FeatureActionPlan, StorageChanges } from 'src/content/features/types';

const hasStorageChange = (
    changes: StorageChanges | undefined,
    id: keyof ISettings
): boolean =>
    !changes || Boolean(changes[id as keyof IStorage] || changes.isEnabled);

const getSettingValue = (settings: IStorage, id: keyof ISettings): unknown => {
    const setting = settings[id] as { value?: unknown } | undefined;

    return setting?.value;
};

const isSettingEnabled = (settings: IStorage, id: keyof ISettings): boolean =>
    Boolean(settings.isEnabled && settings[id]?.enabled);

const getSectionKey = (feature: INormalizedFeature): string =>
    `${feature.categoryKey}::${feature.sectionKey}`;

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
        .filter(({ id }) => hasStorageChange(changes, id))
        .map((feature) => ({
            status: {
                enabled: isSettingEnabled(settings, feature.id),
                value: getSettingValue(settings, feature.id),
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
    features.some(({ id }) => changes[id as keyof IStorage]);

const areAllSectionFeaturesEnabled = (
    features: INormalizedFeature[],
    settings: IStorage
): boolean =>
    Boolean(
        settings.isEnabled && features.every(({ id }) => settings[id]?.enabled)
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
    features: INormalizedFeature[],
    settings: IStorage,
    changes?: StorageChanges
): FeatureActionPlan[] => [
    ...buildFeaturePlans(features, settings, changes),
    ...buildSectionPlans(features, settings, changes),
];

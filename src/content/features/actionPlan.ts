import { Feature } from 'src/shared/types/config';
import { StorageState } from 'src/shared/storage/config';
import { SettingsState } from 'src/shared/types/settings';
import { FeatureActionPlan, StorageChanges } from 'src/content/features/types';

const hasStorageChange = (
    changes: StorageChanges | undefined,
    id: keyof SettingsState
): boolean =>
    !changes || Boolean(changes[id as keyof StorageState] || changes.isEnabled);

const getSettingValue = (
    settings: StorageState,
    id: keyof SettingsState
): unknown => {
    const setting = settings[id] as { value?: unknown } | undefined;

    return setting?.value;
};

const isSettingEnabled = (
    settings: StorageState,
    id: keyof SettingsState
): boolean => Boolean(settings.isEnabled && settings[id]?.enabled);

const getSectionKey = (feature: Feature): string =>
    `${feature.category}::${feature.section}`;

const getSections = (features: Feature[]): Feature[][] =>
    features.reduce<Feature[][]>((sections, feature) => {
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
    features: Feature[],
    settings: StorageState,
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
    features: Feature[],
    changes?: StorageChanges
): boolean =>
    !changes ||
    Boolean(changes.isEnabled) ||
    features.some(({ id }) => changes[id as keyof StorageState]);

const areAllSectionFeaturesEnabled = (
    features: Feature[],
    settings: StorageState
): boolean =>
    Boolean(
        settings.isEnabled && features.every(({ id }) => settings[id]?.enabled)
    );

const getSectionActions = (features: Feature[]) =>
    features.flatMap((feature) => feature.ui?.onFullGroupEnabledActions || []);

const buildSectionPlans = (
    features: Feature[],
    settings: StorageState,
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
    features: Feature[],
    settings: StorageState,
    changes?: StorageChanges
): FeatureActionPlan[] => [
    ...buildFeaturePlans(features, settings, changes),
    ...buildSectionPlans(features, settings, changes),
];

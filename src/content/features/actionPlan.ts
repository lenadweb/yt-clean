import { Feature, SettingsSection } from 'src/shared/types/config';
import {
    getFeatureSetting,
    isFeatureEnabled,
    StorageState,
    toFeatureId,
} from 'src/shared/storage/config';
import { FeatureActionPlan, StorageChanges } from 'src/content/features/types';

const hasStorageChange = (
    changes: StorageChanges | undefined,
    id: Feature['id']
): boolean =>
    !changes || Boolean(changes[toFeatureId(id)] || changes.isEnabled);

const getSettingValue = (
    settings: StorageState,
    id: Feature['id']
): string | undefined => getFeatureSetting(settings, id)?.value;

const buildFeaturePlans = (
    features: Feature[],
    settings: StorageState,
    changes?: StorageChanges
): FeatureActionPlan[] =>
    features
        .filter(({ id }) => hasStorageChange(changes, id))
        .map((feature) => ({
            status: {
                enabled: isFeatureEnabled(settings, feature.id),
                value: getSettingValue(settings, feature.id),
            },
            actions: feature.actions,
            feature,
        }));

const isSectionChanged = (
    section: SettingsSection,
    changes?: StorageChanges
): boolean =>
    !changes ||
    Boolean(changes.isEnabled) ||
    section.features.some(({ id }) => changes[toFeatureId(id)]);

const areAllSectionFeaturesEnabled = (
    section: SettingsSection,
    settings: StorageState
): boolean =>
    Boolean(
        settings.isEnabled &&
        section.features.every(
            ({ id }) => getFeatureSetting(settings, id)?.enabled
        )
    );

const buildSectionPlans = (
    sections: SettingsSection[],
    settings: StorageState,
    changes?: StorageChanges
): FeatureActionPlan[] =>
    sections
        .filter((section) => section.onFullGroupEnabledActions?.length)
        .filter((section) => isSectionChanged(section, changes))
        .map((section) => ({
            status: {
                enabled: areAllSectionFeaturesEnabled(section, settings),
            },
            actions: section.onFullGroupEnabledActions ?? [],
        }));

export const buildFeatureActionPlans = (
    sections: SettingsSection[],
    settings: StorageState,
    changes?: StorageChanges
): FeatureActionPlan[] => [
    ...buildFeaturePlans(
        sections.flatMap((section) => section.features),
        settings,
        changes
    ),
    ...buildSectionPlans(sections, settings, changes),
];

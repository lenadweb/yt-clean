import { FEATURES, FeatureId } from 'src/shared/featureConfig';
import { SettingValue } from 'src/shared/types/settings';

export type { FeatureId };
export type SettingsState = Record<FeatureId, SettingValue>;

export type StorageState = SettingsState & {
    isEnabled: boolean;
};

export const toFeatureId = (id: string): FeatureId => id as FeatureId;

export const getFeatureSetting = (
    settings: StorageState,
    id: string
): SettingValue => settings[toFeatureId(id)];

export const DEFAULT_STORAGE: StorageState = {
    isEnabled: true,
    ...Object.fromEntries(
        FEATURES.map((feature) => [
            feature.id,
            { enabled: feature.defaultEnabled ?? false },
        ])
    ),
} as StorageState;

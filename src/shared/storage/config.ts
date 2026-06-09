import { SettingsState } from 'src/shared/types/settings';
import { FEATURES } from 'src/shared/featureConfig';
import { Feature } from 'src/shared/types/config';

export interface StorageState extends SettingsState {
    isEnabled: boolean;
}

const getDefaultSetting = (feature: Feature) => ({
    enabled: feature.defaultEnabled ?? false,
    ...(feature.defaultValue === undefined
        ? {}
        : { value: feature.defaultValue }),
});

export const DEFAULT_STORAGE: StorageState = {
    isEnabled: true,
    ...Object.fromEntries(
        FEATURES.map((feature) => [feature.id, getDefaultSetting(feature)])
    ),
} as StorageState;

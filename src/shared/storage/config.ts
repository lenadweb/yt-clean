import { FEATURES, FeatureId } from 'src/shared/featureConfig';
import { SettingValue } from 'src/shared/types/settings';
import { PRESET_DEFAULTS, PRESET_IDS, PresetId } from 'src/shared/presets';

export type { FeatureId };
export type SettingsState = Record<FeatureId, SettingValue>;

export type StorageState = SettingsState & {
    isEnabled: boolean;
    activePreset: PresetId;
    presets: Record<PresetId, SettingsState>;
    presetWarningDismissed: boolean;
};

export const toFeatureId = (id: string): FeatureId => id as FeatureId;

export const getFeatureSetting = (
    settings: StorageState,
    id: string
): SettingValue => settings[toFeatureId(id)];

export const isFeatureEnabled = (settings: StorageState, id: string): boolean =>
    Boolean(settings.isEnabled && getFeatureSetting(settings, id)?.enabled);

const defaultPresets = Object.fromEntries(
    PRESET_IDS.map((id) => [id, PRESET_DEFAULTS[id]])
) as Record<PresetId, SettingsState>;

export const DEFAULT_STORAGE: StorageState = {
    isEnabled: true,
    activePreset: 'custom',
    presetWarningDismissed: false,
    presets: defaultPresets,
    ...Object.fromEntries(
        FEATURES.map((feature) => [
            feature.id,
            { enabled: feature.defaultEnabled ?? false },
        ])
    ),
} as StorageState;

import { FEATURES } from 'src/shared/featureConfig';
import { SettingValue } from 'src/shared/types/settings';
import type { SettingsState } from 'src/shared/storage/config';

export const PRESET_IDS = ['light', 'balanced', 'custom'] as const;
export type PresetId = (typeof PRESET_IDS)[number];

export const isStandardPreset = (preset: PresetId): boolean =>
    preset !== 'custom';

// Features that presets must NOT touch when switching (UI/value settings,
// not "cleanliness" toggles).
const PRESET_EXCLUDED = new Set<string>(['speedControl']);

const LIGHT_IDS = new Set<string>([
    'hideShorts',
    'hideNewsSection',
    'hideHoverPreview',
    'adsYoutubeBanner',
    'adsFeedVideo',
    'adsInfoPanel',
    'hideMenuShorts',
]);

const BALANCED_IDS = new Set<string>([
    ...LIGHT_IDS,
    'hideJams',
    'hideMerch',
    'hideEndScreenCards',
    'hideDescriptionAi',
    'hideDescriptionHowMade',
    'hideSearchRefinements',
    'hideSearchTags',
    'hideMenuExploreTrending',
    'hideMenuExploreNews',
]);

export const MANAGED_FEATURE_IDS: string[] = FEATURES.map(
    (feature) => feature.id
).filter((id) => !PRESET_EXCLUDED.has(id));

const buildConfig = (isEnabled: (id: string) => boolean): SettingsState =>
    Object.fromEntries(
        MANAGED_FEATURE_IDS.map((id): [string, SettingValue] => [
            id,
            { enabled: isEnabled(id) },
        ])
    ) as SettingsState;

export const PRESET_DEFAULTS: Record<PresetId, SettingsState> = {
    custom: buildConfig(() => false),
    light: buildConfig((id) => LIGHT_IDS.has(id)),
    balanced: buildConfig((id) => BALANCED_IDS.has(id)),
};

export const getPresetConfig = (
    presetId: PresetId,
    stored?: Record<PresetId, SettingsState>
): SettingsState => ({
    ...PRESET_DEFAULTS[presetId],
    ...stored?.[presetId],
});

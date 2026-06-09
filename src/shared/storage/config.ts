import { ISettings } from 'src/shared/types/settings';
import { FEATURES } from 'src/shared/featureConfig';
import { INormalizedFeature } from 'src/shared/types/config';

export interface IStorage extends ISettings {
    isEnabled: boolean;
}

const getDefaultSetting = (feature: INormalizedFeature) => ({
    enabled: feature.defaultEnabled ?? false,
    ...(feature.defaultValue === undefined
        ? {}
        : { value: feature.defaultValue }),
});

export const DEFAULT_STORAGE: IStorage = {
    isEnabled: true,
    ...Object.fromEntries(
        FEATURES.map((feature) => [feature.id, getDefaultSetting(feature)])
    ),
} as IStorage;

import { IConfig } from 'src/shared/types/config';
import { featureDrafts } from 'src/shared/config/featureList';
import { normalizeFeatures } from 'src/shared/config/normalizeFeature';
import { buildSettingsCategories } from 'src/shared/config/settingsTree';
import { getComponentActionGroups } from 'src/shared/config/componentActions';

export const FEATURES = normalizeFeatures(featureDrafts);

export const CONFIG: IConfig = {
    features: FEATURES,
};

export const getSettingsCategories = () =>
    buildSettingsCategories(CONFIG.features);

export const getComponentsAction = () =>
    getComponentActionGroups(CONFIG.features);

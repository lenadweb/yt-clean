import { IConfig } from 'src/shared/types/config';
import { templateFeatures } from 'src/shared/config/template';
import { feedFeatures } from 'src/shared/config/feed';
import { videoFeatures } from 'src/shared/config/video';
import { sidebarFeatures } from 'src/shared/config/sidebar';
import { normalizeFeatures } from 'src/shared/featureConfig/normalizeFeature';
import { buildSettingsCategories } from 'src/shared/featureConfig/settingsTree';
import { getComponentActionGroups } from 'src/shared/featureConfig/componentActions';

const featureDrafts = [
    ...templateFeatures,
    ...feedFeatures,
    ...videoFeatures,
    ...sidebarFeatures,
];

export const FEATURES = normalizeFeatures(featureDrafts);

export const CONFIG: IConfig = {
    features: FEATURES,
};

export const getSettingsCategories = () =>
    buildSettingsCategories(CONFIG.features);

export const getComponentsAction = () =>
    getComponentActionGroups(CONFIG.features);

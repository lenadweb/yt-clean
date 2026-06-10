import { templateCategory } from 'src/shared/config/template';
import { feedCategory } from 'src/shared/config/feed';
import { videoCategory } from 'src/shared/config/video';
import { sidebarCategory } from 'src/shared/config/sidebar';
import {
    Feature,
    SettingsCategory,
    SettingsSection,
} from 'src/shared/types/config';
import { getComponentActionGroups } from 'src/shared/featureConfig/componentActions';

const categories = [
    templateCategory,
    feedCategory,
    videoCategory,
    sidebarCategory,
];

type CategoryFeatureIds<TCategory> =
    TCategory extends SettingsCategory<infer TId> ? TId : never;

export type FeatureId = CategoryFeatureIds<(typeof categories)[number]>;

export const CATEGORIES: SettingsCategory<FeatureId>[] = categories;

export const SECTIONS: SettingsSection<FeatureId>[] = CATEGORIES.flatMap(
    (category) => category.sections
);

export const FEATURES: Feature<FeatureId>[] = SECTIONS.flatMap(
    (section) => section.features
);

export const getComponentGroups = () => getComponentActionGroups(FEATURES);

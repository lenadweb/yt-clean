import {
    ElementActions,
    IConfig,
    IFeatureDraft,
    INormalizedFeature,
    IAttrAction,
    IActionConfig,
    ISettingsCategory,
} from 'src/shared/types/config';
import { templateFeatures } from 'src/shared/config/template';
import { feedFeatures } from 'src/shared/config/feed';
import { sidebarFeatures } from 'src/shared/config/sidebar';
import { videoFeatures } from 'src/shared/config/video';
import { getAttr } from 'src/shared/utils/getAttr';

const FEATURE_DRAFTS: IFeatureDraft[] = [
    ...templateFeatures,
    ...feedFeatures,
    ...videoFeatures,
    ...sidebarFeatures,
];

const toKebabCase = (value: string): string =>
    value
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase();

const getFeatureAttr = (feature: IFeatureDraft): string =>
    getAttr(`feature-${toKebabCase(feature.storageKey)}`);

const getSectionAttr = (feature: IFeatureDraft): string =>
    getAttr(
        `section-${toKebabCase(feature.category)}-${toKebabCase(
            feature.section
        )}`
    );

const addAttr = (action: IActionConfig, attr: string): IAttrAction => ({
    ...action,
    attr,
});

const normalizeFeature = (feature: IFeatureDraft): INormalizedFeature => ({
    ...feature,
    actions: feature.actions.map((action) =>
        addAttr(action, getFeatureAttr(feature))
    ),
    ui: feature.ui
        ? {
              ...feature.ui,
              onFullGroupEnabledActions:
                  feature.ui.onFullGroupEnabledActions?.map((action) =>
                      addAttr(action, getSectionAttr(feature))
                  ),
          }
        : undefined,
});

export const FEATURES: INormalizedFeature[] =
    FEATURE_DRAFTS.map(normalizeFeature);

export const CONFIG: IConfig = {
    features: FEATURES,
};

const getCategory = (
    categories: ISettingsCategory[],
    title: string
): ISettingsCategory | undefined =>
    categories.find((category) => category.title === title);

export const getSettingsCategories = (): ISettingsCategory[] =>
    CONFIG.features.reduce<ISettingsCategory[]>((categories, feature) => {
        let category = getCategory(categories, feature.category);

        if (!category) {
            category = {
                title: feature.category,
                settings: [],
            };
            categories.push(category);
        }

        let section = category.settings.find(
            (item) => item.title === feature.section
        );

        if (!section) {
            section = {
                title: feature.section,
                groups: [],
                ...feature.ui,
            };
            category.settings.push(section);
        }

        section.groups.push(feature);

        return categories;
    }, []);

export const getComponentsAction = () =>
    CONFIG.features.flatMap((item) => {
        const components = item.actions
            .filter(({ action }) => action === ElementActions.component)
            .map(({ component, insertAfter, urlRegExp }) => ({
                insertAfter: insertAfter as string,
                component: component as string,
                urlRegExp,
            }));

        return components.length
            ? [
                  {
                      storageKey: item.storageKey,
                      components,
                  },
              ]
            : [];
    });

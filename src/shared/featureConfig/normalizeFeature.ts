import {
    IAttrAction,
    IActionConfig,
    IFeatureDraft,
    INormalizedFeature,
} from 'src/shared/types/config';
import { getAttr } from 'src/shared/utils/getAttr';

const toKebabCase = (value: string): string =>
    value
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase();

const getFeatureAttr = (feature: IFeatureDraft): string =>
    getAttr(`feature-${toKebabCase(feature.id)}`);

const getSectionAttr = (feature: IFeatureDraft): string =>
    getAttr(
        `section-${toKebabCase(feature.categoryKey)}-${toKebabCase(
            feature.sectionKey
        )}`
    );

const addAttr = (action: IActionConfig, attr: string): IAttrAction => ({
    ...action,
    attr,
});

export const normalizeFeature = (
    feature: IFeatureDraft
): INormalizedFeature => ({
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

export const normalizeFeatures = (
    features: IFeatureDraft[]
): INormalizedFeature[] => features.map(normalizeFeature);

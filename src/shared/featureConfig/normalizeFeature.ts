import {
    RuntimeAction,
    ActionConfig,
    FeatureDraft,
    Feature,
} from 'src/shared/types/config';
import { getAttr } from 'src/shared/utils/getAttr';

const toKebabCase = (value: string): string =>
    value
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase();

const getFeatureAttr = (feature: FeatureDraft): string =>
    getAttr(`feature-${toKebabCase(feature.id)}`);

const getSectionAttr = (feature: FeatureDraft): string =>
    getAttr(
        `section-${toKebabCase(feature.category)}-${toKebabCase(
            feature.section
        )}`
    );

const addAttr = (action: ActionConfig, attr: string): RuntimeAction => ({
    ...action,
    attr,
});

export const normalizeFeature = <TId extends string>(
    feature: FeatureDraft<TId>
): Feature<TId> => ({
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

export const normalizeFeatures = <TFeature extends FeatureDraft>(
    features: TFeature[]
): Array<Feature<TFeature['id']>> => features.map(normalizeFeature);

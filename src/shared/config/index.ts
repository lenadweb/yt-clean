import {
    ElementActions,
    IConfig,
    ISettingsCategory,
} from 'src/shared/types/config';
import { templateFeatures } from 'src/shared/config/template';
import { feedFeatures } from 'src/shared/config/feed';
import { sidebarFeatures } from 'src/shared/config/sidebar';
import { videoFeatures } from 'src/shared/config/video';

export const FEATURES = [
    ...templateFeatures,
    ...feedFeatures,
    ...videoFeatures,
    ...sidebarFeatures,
];

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
    CONFIG.features
        .flatMap((item) => {
            const hasComponents = item.actions.some(
                ({ action }) => action === ElementActions.component
            );
            return hasComponents
                ? {
                      storageKey: item.storageKey,
                      components: item.actions
                          .filter(
                              ({ action }) =>
                                  action === ElementActions.component
                          )
                          .map(({ component, insertAfter, urlRegExp }) => ({
                              insertAfter: insertAfter as string,
                              component: component as string,
                              urlRegExp,
                          })),
                  }
                : null;
        })
        .filter(Boolean);

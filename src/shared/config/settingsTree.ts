import { INormalizedFeature, ISettingsCategory } from 'src/shared/types/config';

const getCategory = (
    categories: ISettingsCategory[],
    titleKey: string
): ISettingsCategory | undefined =>
    categories.find((category) => category.titleKey === titleKey);

export const buildSettingsCategories = (
    features: INormalizedFeature[]
): ISettingsCategory[] =>
    features.reduce<ISettingsCategory[]>((categories, feature) => {
        let category = getCategory(categories, feature.categoryKey);

        if (!category) {
            category = {
                titleKey: feature.categoryKey,
                settings: [],
            };
            categories.push(category);
        }

        let section = category.settings.find(
            (item) => item.titleKey === feature.sectionKey
        );

        if (!section) {
            section = {
                titleKey: feature.sectionKey,
                groups: [],
                ...feature.ui,
            };
            category.settings.push(section);
        }

        section.groups.push(feature);

        return categories;
    }, []);

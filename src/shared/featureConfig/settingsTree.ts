import { Feature, SettingsCategory } from 'src/shared/types/config';

const getCategory = (
    categories: SettingsCategory[],
    title: string
): SettingsCategory | undefined =>
    categories.find((category) => category.title === title);

export const buildSettingsCategories = (
    features: Feature[]
): SettingsCategory[] =>
    features.reduce<SettingsCategory[]>((categories, feature) => {
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

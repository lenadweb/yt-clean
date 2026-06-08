import {
    ElementActions,
    IActionConfig,
    IFeatureDraft,
    ISettingsSectionOptions,
} from 'src/shared/types/config';

type FeatureInput = Omit<IFeatureDraft, 'category' | 'section'>;
type ActionOptions = Partial<Omit<IActionConfig, 'action' | 'selectors'>>;

export const createFeature =
    (
        category: string,
        section: string,
        sectionOptions?: ISettingsSectionOptions
    ) =>
    (feature: FeatureInput): IFeatureDraft => ({
        category,
        section,
        ...feature,
        ui: {
            ...sectionOptions,
            ...feature.ui,
        },
    });

export const hideAction = (
    selectors: string[],
    options: ActionOptions = {}
): IActionConfig => ({
    action: ElementActions.hide,
    selectors,
    ...options,
});

export const stylesAction = (
    customStyles: string[],
    options: ActionOptions = {}
): IActionConfig => ({
    action: ElementActions.customStyles,
    selectors: [],
    customStyles,
    ...options,
});

export const customAction = (options: ActionOptions = {}): IActionConfig => ({
    action: ElementActions.custom,
    selectors: [],
    ...options,
});

export const componentAction = (
    component: string,
    insertAfter: string,
    options: ActionOptions = {}
): IActionConfig => ({
    action: ElementActions.component,
    selectors: [],
    component,
    insertAfter,
    ...options,
});

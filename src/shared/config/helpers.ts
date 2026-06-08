import {
    ElementActions,
    IAttrAction,
    IFeatureConfig,
    ISettingsSectionOptions,
} from 'src/shared/types/config';
import { getAttr } from 'src/shared/utils/getAttr';

type FeatureInput = Omit<IFeatureConfig, 'category' | 'section'>;
type ActionOptions = Partial<
    Omit<IAttrAction, 'action' | 'attr' | 'selectors'>
>;

export const createFeature =
    (
        category: string,
        section: string,
        sectionOptions?: ISettingsSectionOptions
    ) =>
    (feature: FeatureInput): IFeatureConfig => ({
        category,
        section,
        ...feature,
        ui: {
            ...sectionOptions,
            ...feature.ui,
        },
    });

export const hideAction = (
    attrName: string | undefined,
    selectors: string[],
    options: ActionOptions = {}
): IAttrAction => ({
    action: ElementActions.hide,
    attr: getAttr(attrName),
    selectors,
    ...options,
});

export const stylesAction = (
    attrName: string | undefined,
    customStyles: string[],
    options: ActionOptions = {}
): IAttrAction => ({
    action: ElementActions.customStyles,
    attr: getAttr(attrName),
    selectors: [],
    customStyles,
    ...options,
});

export const customAction = (
    attrName: string | undefined,
    options: ActionOptions = {}
): IAttrAction => ({
    action: ElementActions.custom,
    attr: getAttr(attrName),
    selectors: [],
    ...options,
});

export const componentAction = (
    attrName: string | undefined,
    component: string,
    insertAfter: string,
    options: ActionOptions = {}
): IAttrAction => ({
    action: ElementActions.component,
    attr: getAttr(attrName),
    selectors: [],
    component,
    insertAfter,
    ...options,
});

import {
    ElementActions,
    IComponentAction,
    ICustomAction,
    IHideAction,
    IStylesAction,
    UrlRegExp,
} from 'src/shared/types/config';

type UrlOptions = {
    urlRegExp?: UrlRegExp[];
};

export const hideAction = (
    selectors: string[],
    options: UrlOptions = {}
): IHideAction => ({
    action: ElementActions.hide,
    selectors,
    ...options,
});

export const stylesAction = (
    customStyles: string[],
    options: UrlOptions = {}
): IStylesAction => ({
    action: ElementActions.customStyles,
    customStyles,
    ...options,
});

export const customAction = (
    options: Omit<ICustomAction, 'action'> = {}
): ICustomAction => ({
    action: ElementActions.custom,
    ...options,
});

export const componentAction = (
    component: string,
    insertAfter: string,
    options: UrlOptions = {}
): IComponentAction => ({
    action: ElementActions.component,
    component,
    insertAfter,
    ...options,
});

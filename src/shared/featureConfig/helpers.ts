import {
    ElementActions,
    ComponentAction,
    CustomAction,
    HideAction,
    StylesAction,
    UrlRegExp,
} from 'src/shared/types/config';

type UrlOptions = {
    urlRegExp?: UrlRegExp[];
};

export const hideAction = (
    selectors: string[],
    options: UrlOptions = {}
): HideAction => ({
    action: ElementActions.hide,
    selectors,
    ...options,
});

export const stylesAction = (
    customStyles: string[],
    options: UrlOptions = {}
): StylesAction => ({
    action: ElementActions.customStyles,
    customStyles,
    ...options,
});

export const customAction = (
    options: Omit<CustomAction, 'action'> = {}
): CustomAction => ({
    action: ElementActions.custom,
    ...options,
});

export const componentAction = (
    component: string,
    insertAfter: string,
    options: UrlOptions = {}
): ComponentAction => ({
    action: ElementActions.component,
    component,
    insertAfter,
    ...options,
});

import { ElementActions, IActionConfig } from 'src/shared/types/config';

type ActionOptions = Partial<Omit<IActionConfig, 'action' | 'selectors'>>;

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
    customStyles,
    ...options,
});

export const customAction = (options: ActionOptions = {}): IActionConfig => ({
    action: ElementActions.custom,
    ...options,
});

export const componentAction = (
    component: string,
    insertAfter: string,
    options: ActionOptions = {}
): IActionConfig => ({
    action: ElementActions.component,
    component,
    insertAfter,
    ...options,
});

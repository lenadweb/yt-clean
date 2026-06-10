import type enMessages from 'src/_locales/en/messages.json';
import { ComponentName } from 'src/shared/const';

export enum ElementActions {
    hide = 'hide',
    custom = 'custom',
    customStyles = 'customStyles',
    component = 'component',
}

export type I18nKey = keyof typeof enMessages;

interface ActionBase {
    attr: string;
    urlRegExp?: RegExp[];
}

export type CachedElement = {
    element: Element;
    parent: Node;
    nextSibling: ChildNode | null;
};

export type CustomActionResult = CachedElement[] | void;

export interface HideAction extends ActionBase {
    action: ElementActions.hide;
    selectors: string[];
}

export interface StylesAction extends ActionBase {
    action: ElementActions.customStyles;
    customStyles: string[];
}

export interface CustomAction extends ActionBase {
    action: ElementActions.custom;
    onEnable?: () => Promise<CustomActionResult> | CustomActionResult;
    onDisable?: (value?: CachedElement[]) => unknown;
}

export interface ComponentAction extends ActionBase {
    action: ElementActions.component;
    component: ComponentName;
    insertAfter: string;
}

export type FeatureAction =
    | HideAction
    | StylesAction
    | CustomAction
    | ComponentAction;

export interface Feature<TId extends string = string> {
    id: TId;
    title?: I18nKey;
    isNew?: boolean;
    defaultEnabled?: boolean;
    actions: FeatureAction[];
    onChange?: (value: unknown) => void;
}

export type SectionControls = 'switch' | 'checkboxes';

export interface SettingsSection<TId extends string = string> {
    title: I18nKey;
    isNew?: boolean;
    controls?: SectionControls;
    onFullGroupEnabledActions?: FeatureAction[];
    features: Feature<TId>[];
}

export interface SettingsCategory<TId extends string = string> {
    title: I18nKey;
    sections: SettingsSection<TId>[];
}

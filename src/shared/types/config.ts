import { UrlRegExps } from 'src/shared/const';

export enum ElementActions {
    hide = 'hide',
    custom = 'custom',
    customStyles = 'customStyles',
    component = 'component',
}

export type UrlRegExp = (typeof UrlRegExps)[keyof typeof UrlRegExps];
export type I18nKey = string;

interface ActionBase {
    urlRegExp?: UrlRegExp[];
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
    component: string;
    insertAfter: string;
}

export type ActionConfig =
    | HideAction
    | StylesAction
    | CustomAction
    | ComponentAction;

export type RuntimeAction = ActionConfig & {
    attr: string;
};

export interface SettingsSectionOptions<TAction = ActionConfig> {
    isNew?: boolean;
    withoutCheckboxes?: boolean;
    withoutSwitch?: boolean;
    onFullGroupEnabledActions?: TAction[];
}

export interface FeatureConfig<
    TAction = ActionConfig,
    TId extends string = string,
> {
    category: I18nKey;
    section: I18nKey;
    title?: I18nKey;
    isNew?: boolean;
    id: TId;
    defaultEnabled?: boolean;
    defaultValue?: string;
    actions: TAction[];
    onChange?: (value: unknown) => void;
    ui?: SettingsSectionOptions<TAction>;
}

export type FeatureDraft<TId extends string = string> = FeatureConfig<
    ActionConfig,
    TId
>;
export type Feature<TId extends string = string> = FeatureConfig<
    RuntimeAction,
    TId
>;

export interface SettingsSection extends SettingsSectionOptions<RuntimeAction> {
    title: I18nKey;
    groups: Feature[];
}

export interface SettingsCategory {
    title: I18nKey;
    settings: SettingsSection[];
}

import { ISettings } from 'src/shared/types/settings';
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

export interface IHideAction extends ActionBase {
    action: ElementActions.hide;
    selectors: string[];
}

export interface IStylesAction extends ActionBase {
    action: ElementActions.customStyles;
    customStyles: string[];
}

export interface ICustomAction extends ActionBase {
    action: ElementActions.custom;
    onEnable?: () => Promise<CustomActionResult> | CustomActionResult;
    onDisable?: (value?: CachedElement[]) => unknown;
}

export interface IComponentAction extends ActionBase {
    action: ElementActions.component;
    component: string;
    insertAfter: string;
}

export type IActionConfig =
    | IHideAction
    | IStylesAction
    | ICustomAction
    | IComponentAction;

export type IAttrAction = IActionConfig & {
    attr: string;
};

export interface ISettingsSectionOptions<TAction = IActionConfig> {
    isNew?: boolean;
    withoutCheckboxes?: boolean;
    withoutSwitch?: boolean;
    onFullGroupEnabledActions?: TAction[];
}

export interface IFeatureConfig<TAction = IActionConfig> {
    categoryKey: I18nKey;
    sectionKey: I18nKey;
    titleKey?: I18nKey;
    isNew?: boolean;
    id: keyof ISettings;
    defaultEnabled?: boolean;
    defaultValue?: string;
    actions: TAction[];
    onChange?: (value: unknown) => void;
    ui?: ISettingsSectionOptions<TAction>;
}

export type IFeatureDraft = IFeatureConfig<IActionConfig>;
export type INormalizedFeature = IFeatureConfig<IAttrAction>;

export interface ISettingsSection extends ISettingsSectionOptions<IAttrAction> {
    titleKey: I18nKey;
    groups: INormalizedFeature[];
}

export interface ISettingsCategory {
    titleKey: I18nKey;
    settings: ISettingsSection[];
}

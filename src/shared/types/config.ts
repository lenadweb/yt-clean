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

export interface IActionConfig {
    selectors?: string[];
    customStyles?: string[];
    onEnable?: () => Promise<any> | any;
    onDisable?: (value?: any) => any;
    action: ElementActions;
    component?: string;
    insertAfter?: string;
    urlRegExp?: UrlRegExp[];
}

export interface IAttrAction extends IActionConfig {
    attr: string;
}

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
    actions: TAction[];
    onChange?: (value: any) => void;
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

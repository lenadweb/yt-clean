import { ISettings } from 'src/shared/types/settings';
import { UrlRegExps } from 'src/shared/const';

export enum ElementActions {
    hide = 'hide',
    click = 'click',
    custom = 'custom',
    customStyles = 'customStyles',
    component = 'component',
}

type UrlRegExp = (typeof UrlRegExps)[keyof typeof UrlRegExps];

export interface IActionConfig {
    selectors: string[];
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
    category: string;
    section: string;
    title?: string;
    isNew?: boolean;
    storageKey: keyof ISettings;
    actions: TAction[];
    onChange?: (value: any) => void;
    ui?: ISettingsSectionOptions<TAction>;
}

export type IFeatureDraft = IFeatureConfig<IActionConfig>;
export type INormalizedFeature = IFeatureConfig<IAttrAction>;

export interface ISettingsSection extends ISettingsSectionOptions<IAttrAction> {
    title: string;
    groups: INormalizedFeature[];
}

export interface ISettingsCategory {
    title: string;
    settings: ISettingsSection[];
}

export interface IConfig {
    features: INormalizedFeature[];
}

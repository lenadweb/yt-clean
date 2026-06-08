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

export interface IAttrAction {
    attr: string;
    selectors: string[];
    customStyles?: string[];
    onEnable?: () => Promise<any> | any;
    onDisable?: (value?: any) => any;
    action: ElementActions;
    component?: string;
    insertAfter?: string;
    urlRegExp?: UrlRegExp[];
}

export interface ISettingsSectionOptions {
    isNew?: boolean;
    withoutCheckboxes?: boolean;
    withoutSwitch?: boolean;
    onFullGroupEnabledActions?: IAttrAction[];
}

export interface IFeatureConfig {
    category: string;
    section: string;
    title?: string;
    isNew?: boolean;
    storageKey: keyof ISettings;
    actions: IAttrAction[];
    onChange?: (value: any) => void;
    ui?: ISettingsSectionOptions;
}

export interface ISettingsSection extends ISettingsSectionOptions {
    title: string;
    groups: IFeatureConfig[];
}

export interface ISettingsCategory {
    title: string;
    settings: ISettingsSection[];
}

export interface IConfig {
    features: IFeatureConfig[];
}

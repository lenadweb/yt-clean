import { ISettings } from 'src/shared/types/settings';
import { UrlRegExps } from 'src/shared/const';

export interface ISelector {
    css?: string;
    xpath?: string;
}

export enum ElementActions {
    hide = 'hide',
    click = 'click',
    custom = 'custom',
    dropdown = 'dropdown',
    customStyles = 'customStyles',
    component = 'component',
}

export type CustomQuerySelectorFn = () => Element[];
type UrlRegExp = (typeof UrlRegExps)[keyof typeof UrlRegExps];

export interface IAttrAction {
    title?: string;
    attr: string;
    selectors: string[];
    customStyles?: string[];
    onEnable?: () => Promise<any> | any;
    onDisable?: (value?: any) => any;
    querySelectorFn?: CustomQuerySelectorFn;
    action: ElementActions;
    component?: string;
    insertAfter?: string;
    urlRegExp?: UrlRegExp[];
}

export interface IStorageAction {
    key: string;
    title: string;
    type: 'string' | 'number' | 'boolean';
}

export interface ICheckboxSetting<T> {
    title?: string;
    isNew?: boolean;
    actions: T;
    storageKey: keyof ISettings;
    onChange?: (value: any) => void;
    onDisable?: (value: any) => void;
}

export interface ISubtitleSetting<T> {
    title: 'subtitle';
    type: 'subtitle';
    isNew?: boolean;
    subtitle: (v: any) => string;
    storageKey: keyof ISettings;
}

export interface IDropdownSetting<T> {
    title?: string;
    isNew?: boolean;
    storageKey: keyof ISettings;
    type: 'dropdown';
    actions: T;
    onChange?: (value: any) => void;
    onDisable?: (value: any) => void;
    options: { label: string; value: string }[];
}

export type SettingsGroup<T> =
    | ICheckboxSetting<T>
    | ISubtitleSetting<T>
    | IDropdownSetting<T>;
// | {
//       title?: string;
//       actions: T;
//       storageKey: keyof ISettings;
//       type?: 'dropdown' | 'checkbox' | 'subtitle';
//       onChange?: (value: any) => void;
//       onDisable?: (value: any) => void;
//       options?: { label: string; value: string }[];
//       subtitle?: (v: any) => string;
//   };

export interface IDomActions<T> {
    title: string;
    groups: Array<SettingsGroup<T>>;
    withoutCheckboxes?: boolean;
    withoutSwitch?: boolean;
    onFullGroupEnabledActions?: T;
}

export interface ISettingsBlock<T> {
    title: string;
    settings: Array<IDomActions<T>>;
}

export interface IConfig {
    domActions: ISettingsBlock<IAttrAction[]>[];
    storageActions: ISettingsBlock<IStorageAction[]>[];
}

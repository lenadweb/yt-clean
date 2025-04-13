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
}

export type CustomQuerySelectorFn = () => Element[];

export interface IAttrAction {
    title?: string;
    attr: string;
    selectors: string[];
    onEnable?: () => Promise<any> | any;
    onDisable?: (value: any) => any;
    querySelectorFn?: CustomQuerySelectorFn;
    action: ElementActions;
    urlRegExp?: UrlRegExps[];
}

export interface IStorageAction {
    key: string;
    title: string;
    type: 'string' | 'number' | 'boolean';
}

export interface SettingsGroup<T> {
    title?: string;
    actions: T;
    storageKey: keyof ISettings;
    type?: 'dropdown' | 'checkbox';
    onChange?: (value: any) => void;
    onDisable?: (value: any) => void;
    options?: { label: string; value: string }[];
}

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

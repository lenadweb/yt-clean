export interface ToggleSetting {
    enabled?: boolean;
}

export interface ValuedSetting extends ToggleSetting {
    value?: string;
}

export type SettingValue = ValuedSetting;

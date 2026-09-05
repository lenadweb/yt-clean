import { I18nKey } from 'src/shared/types/config';

export type LocaleMessages = Record<string, { message?: string }>;

let mockMessages: LocaleMessages | undefined;

export const setI18nMockMessages = (
    messages: LocaleMessages | undefined
): void => {
    mockMessages = messages;
};

export const t = (messageKey: I18nKey): string => {
    if (typeof chrome !== 'undefined' && chrome.i18n) {
        const message = chrome.i18n.getMessage(messageKey);
        if (message) {
            return message;
        }
    }
    return mockMessages?.[messageKey]?.message ?? messageKey;
};

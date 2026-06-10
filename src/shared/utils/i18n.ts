import { I18nKey } from 'src/shared/types/config';

export const t = (messageKey: I18nKey): string => {
    if (typeof chrome !== 'undefined' && chrome.i18n) {
        const message = chrome.i18n.getMessage(messageKey);
        if (message) {
            return message;
        }
    }
    return messageKey;
};

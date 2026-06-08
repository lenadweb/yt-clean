export const t = (messageKey: string): string => {
    if (typeof chrome !== 'undefined' && chrome.i18n) {
        const message = chrome.i18n.getMessage(messageKey);
        if (message) {
            return message;
        }
    }
    return messageKey;
};

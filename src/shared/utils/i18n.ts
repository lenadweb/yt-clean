export const t = (text: string): string => {
    if (typeof chrome !== 'undefined' && chrome.i18n) {
        const key = text
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9_]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_+|_+$/g, '');
        const message = chrome.i18n.getMessage(key);
        if (message) {
            return message;
        }
    }
    return text;
};

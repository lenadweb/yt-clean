import { getAttr } from 'src/shared/utils/getAttr';

export type KeywordFilterSetting = {
    enabled: boolean;
    keywords: string[];
};

export const KEYWORD_FILTER_MAX_LENGTH = 100;

export const KEYWORD_HIDDEN_ATTR = getAttr('keyword-hidden');

export const KEYWORD_FILTER_STYLE = `[${KEYWORD_HIDDEN_ATTR}] { display: none !important; }`;

export const normalizeKeyword = (value: string): string =>
    value.replace(/\s+/g, ' ').trim().toLocaleLowerCase();

export const addKeyword = (keywords: string[], value: string): string[] => {
    const keyword = normalizeKeyword(value).slice(0, KEYWORD_FILTER_MAX_LENGTH);

    if (!keyword || keywords.includes(keyword)) return keywords;

    return [...keywords, keyword];
};

export const matchesKeywords = (text: string, keywords: string[]): boolean => {
    if (!keywords.length) return false;

    const normalized = normalizeKeyword(text);
    return keywords.some((keyword) => normalized.includes(keyword));
};

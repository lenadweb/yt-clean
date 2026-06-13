export const BASE_ATTR_PREFIX = 'cln-yt-cust';

export const UrlRegExps = {
    Shorts: /^https:\/\/(www\.)?youtube\.com\/shorts\/[^/?]+/,
    Watch: /^https:\/\/(www\.)?youtube\.com\/watch\?v=[^&]+/,
    Channel: /^https:\/\/(www\.)?youtube\.com\/(c|channel|@)[^/?]+/,
    Search: /^https:\/\/(www\.)?youtube\.com\/results\?search_query=[^&]+/,
} as const;

export const COMPONENT_NAMES = ['PlaybackSpeed', 'ShortsSpeedControl'] as const;

export type ComponentName = (typeof COMPONENT_NAMES)[number];

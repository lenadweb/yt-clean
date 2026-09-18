export const BASE_ATTR_PREFIX = 'cln-yt-cust';

export const SETTINGS_CACHE_KEY = '__yt_clean_settings__';

export const TOGGLE_EXTENSION_COMMAND = 'toggle-extension';
export const EXTENSION_ENABLED_BY_DEFAULT = true;

export const UrlRegExps = {
    Home: /^https:\/\/(www\.)?youtube\.com\/?(\?.*)?$/,
    Shorts: /^https:\/\/(www\.)?youtube\.com\/shorts\/[^/?]+/,
    Watch: /^https:\/\/(www\.)?youtube\.com\/watch\?v=[^&]+/,
    Channel: /^https:\/\/(www\.)?youtube\.com\/(c|channel|@)[^/?]+/,
    Search: /^https:\/\/(www\.)?youtube\.com\/results\?search_query=[^&]+/,
    Subscriptions:
        /^https:\/\/(www\.)?youtube\.com\/feed\/subscriptions(\?.*)?$/,
} as const;

export const GEMINI_ICON_PATH =
    'M480-80q0-83-31.5-156T363-363q-54-54-127-85.5T80-480q83 0 156-31.5T363-597q54-54 85.5-127T480-880q0 83 31.5 156T597-597q54 54 127 85.5T880-480q-83 0-156 31.5T597-363q-54 54-85.5 127T480-80Z';

export const COMPONENT_NAMES = ['PlaybackSpeed', 'ShortsSpeedControl'] as const;

export type ComponentName = (typeof COMPONENT_NAMES)[number];

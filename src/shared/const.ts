export const BASE_ATTR_PREFIX = 'cln-yt-cust';

export const UrlRegExps = {
    Shorts: '^https:\\/\\/(www\\.)?youtube\\.com\\/shorts\\/[^\\/\\?]+',
    Watch: '^https:\\/\\/(www\\.)?youtube\\.com\\/watch\\?v=[^&]+',
    Channel: '^https:\\/\\/(www\\.)?youtube\\.com\\/(c|channel|@)[^\\/\\?]+',
} as const;

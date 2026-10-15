import { UrlRegExps } from 'src/shared/const';

export const getHomeRedirectUrl = (
    url: string,
    signedIn: boolean
): string | null =>
    signedIn && UrlRegExps.Home.test(url)
        ? new URL('/feed/subscriptions', url).href
        : null;

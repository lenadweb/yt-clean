export const INFINITE_FEED_EVENT = 'yt-clean:infinite-feed';

export const HOME_BROWSE_ID = 'FEwhat_to_watch';

type JsonObject = Record<string, unknown>;

const isObject = (value: unknown): value is JsonObject =>
    Boolean(value && typeof value === 'object' && !Array.isArray(value));

const getPath = (value: unknown, path: Array<string | number>): unknown =>
    path.reduce<unknown>(
        (current, key) =>
            isObject(current) || Array.isArray(current)
                ? (current as Record<string | number, unknown>)[key]
                : undefined,
        value
    );

export const isBrowseUrl = (url: string): boolean => {
    try {
        return new URL(url, 'https://www.youtube.com').pathname.endsWith(
            '/youtubei/v1/browse'
        );
    } catch {
        return false;
    }
};

export type ContinuationBody = {
    context: JsonObject;
    continuation: string;
};

export const parseContinuationBody = (
    body: string | null
): ContinuationBody | null => {
    if (!body) return null;

    try {
        const parsed = JSON.parse(body) as unknown;
        return isObject(parsed) &&
            typeof parsed.continuation === 'string' &&
            isObject(parsed.context)
            ? { context: parsed.context, continuation: parsed.continuation }
            : null;
    } catch {
        return null;
    }
};

export const isHomeFeedToken = (token: string): boolean => {
    try {
        const normalized = decodeURIComponent(token)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        return atob(normalized).includes(HOME_BROWSE_ID);
    } catch {
        return false;
    }
};

export const getAppendedItems = (response: unknown): unknown[] | null => {
    const actions = getPath(response, ['onResponseReceivedActions']);
    if (!Array.isArray(actions)) return null;

    for (const action of actions) {
        const items = getPath(action, [
            'appendContinuationItemsAction',
            'continuationItems',
        ]);
        if (Array.isArray(items)) return items;
    }

    return null;
};

export const isContinuationItem = (item: unknown): boolean =>
    isObject(item) && 'continuationItemRenderer' in item;

export const hasContinuation = (items: unknown[]): boolean =>
    items.some(isContinuationItem);

export const getGridItems = (response: unknown): unknown[] => {
    const tabs = getPath(response, [
        'contents',
        'twoColumnBrowseResultsRenderer',
        'tabs',
    ]);
    if (!Array.isArray(tabs)) return [];

    for (const tab of tabs) {
        const contents = getPath(tab, [
            'tabRenderer',
            'content',
            'richGridRenderer',
            'contents',
        ]);
        if (Array.isArray(contents)) return contents;
    }

    return [];
};

export const getItemVideoId = (item: unknown): string | null => {
    const content = getPath(item, ['richItemRenderer', 'content']);
    const lockup = getPath(content, ['lockupViewModel']);

    if (isObject(lockup)) {
        return lockup.contentType === 'LOCKUP_CONTENT_TYPE_VIDEO' &&
            typeof lockup.contentId === 'string'
            ? lockup.contentId
            : null;
    }

    const videoId = getPath(content, ['videoRenderer', 'videoId']);
    return typeof videoId === 'string' ? videoId : null;
};

export const collectVideoIds = (items: unknown[]): string[] =>
    items.flatMap((item) => {
        const id = getItemVideoId(item);
        return id ? [id] : [];
    });

export const pickFreshItems = (
    gridItems: unknown[],
    seen: Set<string>
): unknown[] =>
    gridItems.filter((item) => {
        const id = getItemVideoId(item);
        if (!id || seen.has(id)) return false;

        seen.add(id);
        return true;
    });

export const isInfiniteFeedCached = (raw: string | null): boolean => {
    if (!raw) return false;

    try {
        const settings = JSON.parse(raw) as {
            isEnabled?: unknown;
            infiniteHomeFeed?: { enabled?: unknown };
        } | null;

        return (
            settings?.isEnabled !== false &&
            settings?.infiniteHomeFeed?.enabled === true
        );
    } catch {
        return false;
    }
};

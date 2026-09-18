export const ORIGINAL_TITLES_EVENT = 'yt-clean:original-titles';

const VIDEO_ID_REGEXP = /^[\w-]{11}$/;

export const getVideoIdFromUrl = (
    href: string | null | undefined,
    base = 'https://www.youtube.com'
): string | null => {
    if (!href) return null;

    try {
        const url = new URL(href, base);
        if (url.pathname !== '/watch') return null;

        const id = url.searchParams.get('v');
        return id && VIDEO_ID_REGEXP.test(id) ? id : null;
    } catch {
        return null;
    }
};

export const getOembedUrl = (videoId: string): string =>
    `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(
        `https://www.youtube.com/watch?v=${videoId}`
    )}`;

export const normalizeTitle = (title: string): string =>
    title.replace(/\s+/g, ' ').trim();

export const parseEnabledDetail = (detail: unknown): boolean | null => {
    if (typeof detail !== 'string') return null;

    try {
        const payload = JSON.parse(detail) as { enabled?: unknown };
        return typeof payload.enabled === 'boolean' ? payload.enabled : null;
    } catch {
        return null;
    }
};

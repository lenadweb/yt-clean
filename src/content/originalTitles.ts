import { onUrlChange } from 'src/shared/utils/navigation';
import { waitForBody } from 'src/shared/utils/dom';
import {
    getOembedUrl,
    getVideoIdFromUrl,
    normalizeTitle,
    ORIGINAL_TITLES_EVENT,
    parseEnabledDetail,
} from 'src/shared/utils/originalTitles';

type TitleSource = {
    card: string;
    link: string;
    text: string;
};

type TitleTarget = {
    videoId: string;
    element: Element;
};

const TITLE_SOURCES: TitleSource[] = [
    {
        card: 'yt-lockup-view-model',
        link: 'a.ytLockupMetadataViewModelTitle',
        text: 'a.ytLockupMetadataViewModelTitle .ytAttributedStringHost',
    },
    {
        card: 'ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, ytd-rich-grid-media, ytd-playlist-video-renderer, ytd-playlist-panel-video-renderer',
        link: 'a#video-title, a#video-title-link, a#thumbnail',
        text: '#video-title yt-formatted-string, yt-formatted-string#video-title, span#video-title, a#video-title:not(:has(*))',
    },
];

const WATCH_TITLE_SELECTOR = 'ytd-watch-metadata #title h1 yt-formatted-string';
const MAX_CONCURRENT_REQUESTS = 4;

const titles = new Map<string, string | null>();
const queue: string[] = [];
const queued = new Set<string>();
const replaced = new Map<Element, string>();

let enabled = false;
let activeRequests = 0;
let frameId: number | null = null;
let observer: MutationObserver | null = null;
let started = false;

const fetchTitle = async (videoId: string): Promise<string | null> => {
    try {
        const response = await fetch(getOembedUrl(videoId), {
            credentials: 'omit',
        });
        if (!response.ok) return null;

        const data = (await response.json()) as { title?: unknown };
        return typeof data.title === 'string'
            ? normalizeTitle(data.title)
            : null;
    } catch {
        return null;
    }
};

const processQueue = (): void => {
    while (enabled && activeRequests < MAX_CONCURRENT_REQUESTS) {
        const videoId = queue.shift();
        if (!videoId) return;

        activeRequests += 1;
        fetchTitle(videoId).then((title) => {
            titles.set(videoId, title);
            queued.delete(videoId);
            activeRequests -= 1;
            scheduleRun();
            processQueue();
        });
    }
};

const requestTitle = (videoId: string): void => {
    if (titles.has(videoId) || queued.has(videoId)) return;

    queued.add(videoId);
    queue.push(videoId);
    processQueue();
};

const collectTargets = (): TitleTarget[] => {
    const targets: TitleTarget[] = [];

    TITLE_SOURCES.forEach(({ card, link, text }) => {
        document.querySelectorAll(card).forEach((element) => {
            const videoId = getVideoIdFromUrl(
                element.querySelector(link)?.getAttribute('href')
            );
            const title = element.querySelector(text);

            if (videoId && title) targets.push({ videoId, element: title });
        });
    });

    const watchTitle = document.querySelector(WATCH_TITLE_SELECTOR);
    const watchId = getVideoIdFromUrl(window.location.href);
    if (watchTitle && watchId) {
        targets.push({ videoId: watchId, element: watchTitle });
    }

    return targets;
};

const applyTitle = ({ videoId, element }: TitleTarget): void => {
    const original = titles.get(videoId);
    if (original === undefined) {
        requestTitle(videoId);
        return;
    }
    if (!original) return;

    const current = element.textContent ?? '';
    if (normalizeTitle(current) === original) return;

    replaced.set(element, current);
    element.textContent = original;
    if (element.hasAttribute('title')) {
        element.setAttribute('title', original);
    }
};

const pruneReplaced = (): void => {
    replaced.forEach((_, element) => {
        if (!element.isConnected) replaced.delete(element);
    });
};

const run = (): void => {
    if (!enabled) return;

    pruneReplaced();
    collectTargets().forEach(applyTitle);
};

function scheduleRun(): void {
    if (frameId !== null || !enabled) return;

    frameId = requestAnimationFrame(() => {
        frameId = null;
        run();
    });
}

const restoreTitles = (): void => {
    replaced.forEach((translated, element) => {
        if (element.isConnected) element.textContent = translated;
    });
    replaced.clear();
};

const observe = (): void => {
    observer?.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
    });
};

const start = (): void => {
    if (started) return;
    started = true;

    waitForBody().then(() => {
        observer = new MutationObserver(scheduleRun);
        if (enabled) observe();
        run();
    });
    onUrlChange(scheduleRun);
};

const setEnabled = (isEnabled: boolean): void => {
    if (isEnabled === enabled) {
        if (enabled) scheduleRun();
        return;
    }

    enabled = isEnabled;

    if (enabled) {
        start();
        observe();
        scheduleRun();
        return;
    }

    observer?.disconnect();
    queue.length = 0;
    queued.clear();
    restoreTitles();
};

export const startOriginalTitles = (): void => {
    document.addEventListener(ORIGINAL_TITLES_EVENT, (event) => {
        const value = parseEnabledDetail(
            event instanceof CustomEvent ? event.detail : null
        );
        if (value !== null) setEnabled(value);
    });
};

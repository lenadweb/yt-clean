import { storage } from 'src/shared/storage';
import { UrlRegExps } from 'src/shared/const';
import { onUrlChange } from 'src/shared/utils/navigation';
import { waitForBody } from 'src/shared/utils/dom';
import { VIDEO_FILTER_HIDDEN_ATTR } from 'src/shared/videoFilter';
import { matchesKeywords } from 'src/shared/videoFilter/keywords';
import {
    DurationFilterSetting,
    isDurationFilterActive,
    isDurationOutOfRange,
    parseDuration,
} from 'src/shared/videoFilter/duration';

type CardSource = {
    card: string;
    title: string;
    channel: string;
    duration: string;
};

type ActiveFilters = {
    keywords: string[];
    duration: DurationFilterSetting | null;
};

const CARD_SOURCES: CardSource[] = [
    {
        card: 'yt-lockup-view-model',
        title: '.ytLockupMetadataViewModelTitle',
        channel: '.ytContentMetadataViewModelMetadataText',
        duration: '.ytBadgeShapeText',
    },
    {
        card: 'ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, ytd-rich-grid-media',
        title: '#video-title',
        channel: 'ytd-channel-name #text',
        duration:
            'ytd-thumbnail-overlay-time-status-renderer #text, ytd-thumbnail-overlay-time-status-renderer .ytBadgeShapeText',
    },
];

const CARD_WRAPPER_SELECTOR = 'ytd-rich-item-renderer';
const EXCLUDED_URLS = [UrlRegExps.Search];

const NO_FILTERS: ActiveFilters = { keywords: [], duration: null };

const getActiveFilters = (): ActiveFilters => {
    const { isEnabled, keywordFilter, durationFilter } = storage.settings;

    if (!isEnabled) return NO_FILTERS;
    if (EXCLUDED_URLS.some((regexp) => regexp.test(window.location.href))) {
        return NO_FILTERS;
    }

    return {
        keywords: keywordFilter?.enabled ? keywordFilter.keywords : [],
        duration:
            durationFilter && isDurationFilterActive(durationFilter)
                ? durationFilter
                : null,
    };
};

const hasActiveFilters = ({ keywords, duration }: ActiveFilters): boolean =>
    keywords.length > 0 || duration !== null;

const getText = (element: Element, selector: string): string =>
    element.querySelector(selector)?.textContent ?? '';

const getDuration = (element: Element, selector: string): number | null => {
    for (const badge of element.querySelectorAll(selector)) {
        const seconds = parseDuration(badge.textContent ?? '');
        if (seconds !== null) return seconds;
    }

    return null;
};

const isCardFiltered = (
    element: Element,
    source: CardSource,
    { keywords, duration }: ActiveFilters
): boolean => {
    if (keywords.length) {
        const text = `${getText(element, source.title)} ${getText(element, source.channel)}`;
        if (matchesKeywords(text, keywords)) return true;
    }

    if (duration) {
        const seconds = getDuration(element, source.duration);
        if (seconds !== null && isDurationOutOfRange(seconds, duration)) {
            return true;
        }
    }

    return false;
};

const findFilteredCards = (filters: ActiveFilters): Set<Element> => {
    const filtered = new Set<Element>();
    if (!hasActiveFilters(filters)) return filtered;

    CARD_SOURCES.forEach((source) => {
        document.querySelectorAll(source.card).forEach((element) => {
            if (isCardFiltered(element, source, filters)) {
                filtered.add(element.closest(CARD_WRAPPER_SELECTOR) ?? element);
            }
        });
    });

    return filtered;
};

const applyFilters = (filters: ActiveFilters): void => {
    const filtered = findFilteredCards(filters);

    document
        .querySelectorAll(`[${VIDEO_FILTER_HIDDEN_ATTR}]`)
        .forEach((element) => {
            if (!filtered.has(element)) {
                element.removeAttribute(VIDEO_FILTER_HIDDEN_ATTR);
            }
        });

    filtered.forEach((element) => {
        if (!element.hasAttribute(VIDEO_FILTER_HIDDEN_ATTR)) {
            element.setAttribute(VIDEO_FILTER_HIDDEN_ATTR, '');
        }
    });
};

let frameId: number | null = null;

const scheduleFilters = (): void => {
    if (frameId !== null) return;

    frameId = requestAnimationFrame(() => {
        frameId = null;
        applyFilters(getActiveFilters());
    });
};

const observer = new MutationObserver(scheduleFilters);
let isObserving = false;

const syncVideoFilter = (): void => {
    const filters = getActiveFilters();
    const isActive = hasActiveFilters(filters);

    if (isActive && !isObserving) {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
        });
        isObserving = true;
    }

    if (!isActive && isObserving) {
        observer.disconnect();
        isObserving = false;
    }

    applyFilters(filters);
};

export const startVideoFilter = (): void => {
    waitForBody().then(() => {
        syncVideoFilter();
        storage.onChange(syncVideoFilter);
        onUrlChange(syncVideoFilter);
    });
};

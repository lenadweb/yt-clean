import { storage } from 'src/shared/storage';
import { UrlRegExps } from 'src/shared/const';
import { onUrlChange } from 'src/shared/utils/navigation';
import { waitForBody } from 'src/shared/utils/dom';
import { KEYWORD_HIDDEN_ATTR, matchesKeywords } from 'src/shared/keywordFilter';

type CardSource = {
    card: string;
    title: string;
    channel: string;
};

const CARD_SOURCES: CardSource[] = [
    {
        card: 'yt-lockup-view-model',
        title: '.ytLockupMetadataViewModelTitle',
        channel: '.ytContentMetadataViewModelMetadataText',
    },
    {
        card: 'ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, ytd-rich-grid-media',
        title: '#video-title',
        channel: 'ytd-channel-name #text',
    },
];

const CARD_WRAPPER_SELECTOR = 'ytd-rich-item-renderer';
const EXCLUDED_URLS = [UrlRegExps.Search];

const getActiveKeywords = (): string[] => {
    const { isEnabled, keywordFilter } = storage.settings;

    if (!isEnabled || !keywordFilter?.enabled) return [];
    if (EXCLUDED_URLS.some((regexp) => regexp.test(window.location.href))) {
        return [];
    }

    return keywordFilter.keywords;
};

const getText = (element: Element, selector: string): string =>
    element.querySelector(selector)?.textContent ?? '';

const findMatchedCards = (keywords: string[]): Set<Element> => {
    const matched = new Set<Element>();
    if (!keywords.length) return matched;

    CARD_SOURCES.forEach(({ card, title, channel }) => {
        document.querySelectorAll(card).forEach((element) => {
            const text = `${getText(element, title)} ${getText(element, channel)}`;

            if (matchesKeywords(text, keywords)) {
                matched.add(element.closest(CARD_WRAPPER_SELECTOR) ?? element);
            }
        });
    });

    return matched;
};

const applyFilter = (keywords: string[]): void => {
    const matched = findMatchedCards(keywords);

    document.querySelectorAll(`[${KEYWORD_HIDDEN_ATTR}]`).forEach((element) => {
        if (!matched.has(element)) {
            element.removeAttribute(KEYWORD_HIDDEN_ATTR);
        }
    });

    matched.forEach((element) => {
        if (!element.hasAttribute(KEYWORD_HIDDEN_ATTR)) {
            element.setAttribute(KEYWORD_HIDDEN_ATTR, '');
        }
    });
};

let frameId: number | null = null;

const scheduleFilter = (): void => {
    if (frameId !== null) return;

    frameId = requestAnimationFrame(() => {
        frameId = null;
        applyFilter(getActiveKeywords());
    });
};

const observer = new MutationObserver(scheduleFilter);
let isObserving = false;

const syncKeywordFilter = (): void => {
    const keywords = getActiveKeywords();

    if (keywords.length && !isObserving) {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
        });
        isObserving = true;
    }

    if (!keywords.length && isObserving) {
        observer.disconnect();
        isObserving = false;
    }

    applyFilter(keywords);
};

export const startKeywordFilter = (): void => {
    waitForBody().then(() => {
        syncKeywordFilter();
        storage.onChange(syncKeywordFilter);
        onUrlChange(syncKeywordFilter);
    });
};

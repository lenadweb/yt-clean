import { UrlRegExps } from 'src/shared/const';
import {
    disconnectObserver,
    observeElementChanges,
    waitForElement,
} from 'src/shared/utils/dom';
import { setPlaybackSpeed } from 'src/shared/utils/yt';
import { CachedElement } from 'src/shared/types/config';

const SHORTS_LOOP_OBSERVER_ID = '498d5cf9-dbda-4ded-b2a0-0218d1bc833d';
const SHORTS_PLAYER_SELECTOR = '#shorts-player';
const SHORTS_VIDEO_SELECTOR = `${SHORTS_PLAYER_SELECTOR} video`;
const SHORTS_ENDED_PLAYER_SELECTOR = `${SHORTS_PLAYER_SELECTOR}.ended-mode`;
const SHORTS_NEXT_BUTTON_SELECTOR = '#navigation-button-down button';

const CHANNEL_TRAILER_SELECTOR =
    'ytd-two-column-browse-results-renderer ytd-channel-video-player-renderer';
const CHANNEL_TRAILER_VIDEO_SELECTOR = `${CHANNEL_TRAILER_SELECTOR} .html5-video-player:not(.unstarted-mode) video[src]`;
const VIDEO_PLAYER_SELECTOR =
    '.html5-video-player:not(.unstarted-mode) video[src]';

type UrlRegExp = (typeof UrlRegExps)[keyof typeof UrlRegExps];

const isCurrentUrlMatched = (urlRegExps: UrlRegExp[]): boolean =>
    urlRegExps.some((regexp) => new RegExp(regexp).test(window.location.href));

export const syncPlaybackSpeed = async (value: unknown) => {
    if (typeof value !== 'string') return;
    if (value === 'disabled') return;

    if (!isCurrentUrlMatched([UrlRegExps.Watch, UrlRegExps.Channel])) {
        return;
    }

    await waitForElement(VIDEO_PLAYER_SELECTOR);
    setPlaybackSpeed(value);
};

const removeLoopAttribute = (element: Element) => {
    if (element.hasAttribute('loop')) {
        element.removeAttribute('loop');
    }
};

const observeShortsLoopAttribute = (root: HTMLElement) => {
    observeElementChanges(
        SHORTS_LOOP_OBSERVER_ID,
        SHORTS_VIDEO_SELECTOR,
        removeLoopAttribute,
        {
            childList: false,
            subtree: false,
            attributes: true,
            attributeFilter: ['loop'],
            attributeOldValue: false,
            characterData: false,
            characterDataOldValue: false,
        },
        root
    );
};

const clickNextShort = async () => {
    await waitForElement(SHORTS_ENDED_PLAYER_SELECTOR);
    const button = await waitForElement(SHORTS_NEXT_BUTTON_SELECTOR);
    (button as HTMLButtonElement | null)?.click();
};

export const enableAutoNextShorts = async () => {
    try {
        const root = await waitForElement(SHORTS_VIDEO_SELECTOR, 3000);
        if (!root) return;

        observeShortsLoopAttribute(root as HTMLElement);
        await clickNextShort();
    } catch (error) {
        console.error('Element not found or error occurred:', error);
    }
};

export const disableAutoNextShorts = () => {
    disconnectObserver(SHORTS_LOOP_OBSERVER_ID);
};

const cacheAndRemoveElement = (element: Element): CachedElement | null => {
    if (!element.parentNode) return null;

    const cachedElement = {
        element,
        parent: element.parentNode,
        nextSibling: element.nextSibling,
    };

    element.remove();
    return cachedElement;
};

const removeElements = (elements: Array<Element | null>): CachedElement[] =>
    elements.flatMap((element) => {
        if (!element) return [];

        const cachedElement = cacheAndRemoveElement(element);
        return cachedElement ? [cachedElement] : [];
    });

export const hideChannelTrailer = async (): Promise<CachedElement[] | void> => {
    try {
        await waitForElement(CHANNEL_TRAILER_VIDEO_SELECTOR);

        const trailer = await waitForElement(CHANNEL_TRAILER_SELECTOR);
        return removeElements([trailer]);
    } catch {
        return;
    }
};

export const restoreChannelTrailer = async (
    cachedElements: CachedElement[] = []
) => {
    try {
        cachedElements.forEach(({ parent, element, nextSibling }) => {
            parent.insertBefore(element, nextSibling);
        });
    } catch (error) {
        console.error(error);
    }
};

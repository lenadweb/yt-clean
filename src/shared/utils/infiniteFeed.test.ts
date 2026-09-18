import { describe, expect, it } from 'vitest';
import {
    collectVideoIds,
    getAppendedItems,
    getGridItems,
    getItemVideoId,
    hasContinuation,
    isBrowseUrl,
    isHomeFeedToken,
    isInfiniteFeedCached,
    parseContinuationBody,
    pickFreshItems,
} from 'src/shared/utils/infiniteFeed';

const lockup = (id: string, type = 'LOCKUP_CONTENT_TYPE_VIDEO') => ({
    richItemRenderer: {
        content: { lockupViewModel: { contentId: id, contentType: type } },
    },
});

const legacy = (id: string) => ({
    richItemRenderer: { content: { videoRenderer: { videoId: id } } },
});

const continuation = {
    continuationItemRenderer: {
        continuationEndpoint: { continuationCommand: { token: 'next' } },
    },
};

describe('isBrowseUrl', () => {
    it('matches the browse endpoint only', () => {
        expect(isBrowseUrl('/youtubei/v1/browse?prettyPrint=false')).toBe(true);
        expect(isBrowseUrl('https://www.youtube.com/youtubei/v1/browse')).toBe(
            true
        );
        expect(isBrowseUrl('/youtubei/v1/next')).toBe(false);
    });
});

describe('parseContinuationBody', () => {
    it('returns the context of continuation requests', () => {
        expect(
            parseContinuationBody(
                JSON.stringify({ context: { client: {} }, continuation: 'x' })
            )
        ).toEqual({ context: { client: {} }, continuation: 'x' });
    });

    it('ignores first-page and malformed requests', () => {
        expect(
            parseContinuationBody(
                JSON.stringify({ context: {}, browseId: 'FEwhat_to_watch' })
            )
        ).toBeNull();
        expect(parseContinuationBody('{')).toBeNull();
        expect(parseContinuationBody(null)).toBeNull();
    });
});

describe('isHomeFeedToken', () => {
    it('detects home feed continuation tokens', () => {
        const token = encodeURIComponent(
            btoa(
                '\u00e2\u00a9\u0085\u00b2\u0002\u0012\u000fFEwhat_to_watch\u001a\u0001x'
            )
        );
        expect(isHomeFeedToken(token)).toBe(true);
    });

    it('rejects other tokens', () => {
        expect(isHomeFeedToken(btoa('\u0012\u000fFEsubscriptions'))).toBe(
            false
        );
        expect(isHomeFeedToken('%%%')).toBe(false);
    });
});

describe('getAppendedItems', () => {
    it('reads items of an append action', () => {
        const items = [lockup('a'), continuation];
        expect(
            getAppendedItems({
                onResponseReceivedActions: [
                    {
                        appendContinuationItemsAction: {
                            continuationItems: items,
                        },
                    },
                ],
            })
        ).toBe(items);
    });

    it('ignores reload commands', () => {
        expect(
            getAppendedItems({
                onResponseReceivedActions: [
                    {
                        reloadContinuationItemsCommand: {
                            continuationItems: [],
                        },
                    },
                ],
            })
        ).toBeNull();
        expect(getAppendedItems({})).toBeNull();
    });
});

describe('hasContinuation', () => {
    it('detects the continuation item', () => {
        expect(hasContinuation([lockup('a'), continuation])).toBe(true);
        expect(hasContinuation([lockup('a')])).toBe(false);
    });
});

describe('getGridItems', () => {
    it('reads the rich grid of a browse response', () => {
        const contents = [lockup('a'), continuation];
        expect(
            getGridItems({
                contents: {
                    twoColumnBrowseResultsRenderer: {
                        tabs: [
                            {
                                tabRenderer: {
                                    content: { richGridRenderer: { contents } },
                                },
                            },
                        ],
                    },
                },
            })
        ).toBe(contents);
        expect(getGridItems({})).toEqual([]);
    });
});

describe('getItemVideoId', () => {
    it('reads ids of video lockups and legacy renderers', () => {
        expect(getItemVideoId(lockup('a'))).toBe('a');
        expect(getItemVideoId(legacy('b'))).toBe('b');
    });

    it('ignores non-video items', () => {
        expect(
            getItemVideoId(lockup('p', 'LOCKUP_CONTENT_TYPE_PLAYLIST'))
        ).toBeNull();
        expect(getItemVideoId(continuation)).toBeNull();
        expect(getItemVideoId({ richSectionRenderer: {} })).toBeNull();
    });
});

describe('pickFreshItems', () => {
    it('keeps unseen videos once and records them', () => {
        const seen = new Set(collectVideoIds([lockup('a')]));
        const fresh = pickFreshItems(
            [lockup('a'), lockup('b'), lockup('b'), continuation],
            seen
        );

        expect(collectVideoIds(fresh)).toEqual(['b']);
        expect(seen.has('b')).toBe(true);
    });
});

describe('isInfiniteFeedCached', () => {
    it('reads the cached setting', () => {
        expect(
            isInfiniteFeedCached(
                JSON.stringify({ infiniteHomeFeed: { enabled: true } })
            )
        ).toBe(true);
        expect(
            isInfiniteFeedCached(
                JSON.stringify({
                    isEnabled: false,
                    infiniteHomeFeed: { enabled: true },
                })
            )
        ).toBe(false);
        expect(isInfiniteFeedCached(null)).toBe(false);
    });
});

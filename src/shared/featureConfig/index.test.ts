import { describe, expect, it } from 'vitest';
import {
    CATEGORIES,
    FEATURES,
    SECTIONS,
    getComponentGroups,
} from 'src/shared/featureConfig';
import { DEFAULT_STORAGE } from 'src/shared/storage/config';
import { BASE_ATTR_PREFIX, UrlRegExps } from 'src/shared/const';
import { ElementActions } from 'src/shared/types/config';

const storageKeys = new Set(Object.keys(DEFAULT_STORAGE));

describe('FEATURES', () => {
    it('builds a non-empty feature list', () => {
        expect(FEATURES.length).toBeGreaterThan(0);
    });

    it('gives every action a prefixed body attribute', () => {
        const actions = FEATURES.flatMap((f) => f.actions);
        expect(actions.length).toBeGreaterThan(0);
        actions.forEach((action) => {
            expect(action.attr.startsWith(`${BASE_ATTR_PREFIX}-`)).toBe(true);
        });
    });

    it('has no duplicated feature ids', () => {
        const ids = FEATURES.map((feature) => feature.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('only references settings ids that exist in storage defaults', () => {
        FEATURES.forEach((feature) => {
            expect(storageKeys.has(feature.id)).toBe(true);
        });
    });

    it('generates one default setting per feature', () => {
        const nonFeatureKeys = [
            'isEnabled',
            'activePreset',
            'presets',
            'presetWarningDismissed',
        ];
        expect(storageKeys.size).toBe(FEATURES.length + nonFeatureKeys.length);
    });
});

describe('CATEGORIES', () => {
    it('exposes every feature through a category and section', () => {
        expect(CATEGORIES.length).toBeGreaterThan(0);

        const featureCount = CATEGORIES.flatMap((c) => c.sections).flatMap(
            (s) => s.features
        ).length;

        expect(featureCount).toBe(FEATURES.length);
    });

    it('gives every section action a prefixed body attribute', () => {
        SECTIONS.flatMap(
            (section) => section.onFullGroupEnabledActions ?? []
        ).forEach((action) => {
            expect(action.attr.startsWith(`${BASE_ATTR_PREFIX}-`)).toBe(true);
        });
    });
});

describe('getComponentGroups', () => {
    it('returns component groups bound to known settings ids', () => {
        getComponentGroups().forEach((group) => {
            expect(storageKeys.has(group.id)).toBe(true);
            expect(group.components.length).toBeGreaterThan(0);
        });
    });
});

describe('hideLiveChat', () => {
    it('removes the fixed-panel chat layout as well as the chat frame', () => {
        const feature = FEATURES.find(({ id }) => id === 'hideLiveChat');
        const hideAction = feature?.actions.find(
            ({ action }) => action === ElementActions.hide
        );
        const stylesAction = feature?.actions.find(
            ({ action }) => action === ElementActions.customStyles
        );

        expect(hideAction).toMatchObject({
            selectors: expect.arrayContaining([
                'ytd-live-chat-frame#chat',
                'div#chat-container-live-stream-chat',
                '#full-bleed-chat-container #panels-full-bleed-container',
            ]),
        });
        expect(stylesAction).toMatchObject({
            customStyles: expect.arrayContaining([
                expect.stringContaining('padding-right: 0 !important'),
                expect.stringContaining('object-fit: contain !important'),
            ]),
        });
        expect(feature?.onChange).toBeTypeOf('function');
    });
});

describe('hideMembersOnlyVideos', () => {
    it('supports the legacy and current members-only badges across feeds', () => {
        const feature = FEATURES.find(
            ({ id }) => id === 'hideMembersOnlyVideos'
        );
        const hideAction = feature?.actions.find(
            ({ action }) => action === ElementActions.hide
        );
        const selector =
            hideAction && 'selectors' in hideAction
                ? hideAction.selectors?.[0]
                : undefined;

        expect(selector).toEqual(
            expect.stringContaining('.badge-style-type-members-only')
        );
        expect(selector).toEqual(
            expect.stringContaining('.yt-badge-shape--membership')
        );
        expect(selector).toEqual(
            expect.stringContaining('ytd-rich-item-renderer')
        );
        expect(selector).toEqual(
            expect.stringContaining('yt-lockup-view-model')
        );
        expect(selector).toEqual(
            expect.stringContaining('ytd-playlist-video-renderer')
        );
    });
});

describe('hideWatchedVideos', () => {
    const pageFeatures = [
        ['hideWatchedVideosHome', UrlRegExps.Home],
        ['hideWatchedVideosSubscriptions', UrlRegExps.Subscriptions],
        ['hideWatchedVideosChannels', UrlRegExps.Channel],
        ['hideWatchedVideosRecommendations', UrlRegExps.Watch],
    ] as const;

    it.each(pageFeatures)('scopes %s to its YouTube page', (id, urlRegExp) => {
        const feature = FEATURES.find((candidate) => candidate.id === id);
        const hideAction = feature?.actions.find(
            ({ action }) => action === ElementActions.hide
        );

        expect(hideAction?.urlRegExp).toEqual([urlRegExp]);
    });

    it('recognizes legacy and current progress bars from 34 percent', () => {
        const feature = FEATURES.find(
            ({ id }) => id === 'hideWatchedVideosHome'
        );
        const hideAction = feature?.actions.find(
            ({ action }) => action === ElementActions.hide
        );
        const selector =
            hideAction && 'selectors' in hideAction
                ? hideAction.selectors?.[0]
                : undefined;

        expect(selector).toEqual(
            expect.stringContaining(
                '#progress.ytd-thumbnail-overlay-resume-playback-renderer'
            )
        );
        expect(selector).toEqual(
            expect.stringContaining(
                '.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment'
            )
        );
        expect(selector).toEqual(
            expect.stringContaining('[style*="width: 34"]')
        );
        expect(selector).not.toEqual(
            expect.stringContaining('[style*="width: 33"]')
        );
        expect(selector).toEqual(
            expect.stringContaining('yt-lockup-view-model')
        );
    });
});

describe('hideChannelPictures', () => {
    it('hides the owner avatar and in-player channel branding', () => {
        const feature = FEATURES.find(({ id }) => id === 'hideChannelPictures');
        const hideAction = feature?.actions.find(
            ({ action }) => action === ElementActions.hide
        );

        expect(hideAction).toMatchObject({
            selectors: expect.arrayContaining([
                'ytd-watch-metadata ytd-video-owner-renderer a:has(> #avatar)',
                'ytd-watch-metadata ytd-video-owner-renderer yt-decorated-avatar-view-model',
                'ytd-player .iv-branding',
                'ytd-player .ytp-button.branding-img-container',
            ]),
        });
    });
});

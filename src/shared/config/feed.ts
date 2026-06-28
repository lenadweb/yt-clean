import { category, feature, section } from 'src/shared/featureConfig/dsl';
import { UrlRegExps } from 'src/shared/const';
import {
    disableAutoSkipAds,
    enableAutoSkipAds,
} from 'src/shared/featureHandlers/ads';

const GHOST_GRID_SKELETON = 'ytd-rich-grid-renderer ytd-ghost-grid-renderer';

export const feedCategory = category('feed_and_recommendations', [
    section('compact_mode', { isNew: true, controls: 'switch' }, [
        feature({
            id: 'compactMode',
            title: 'compact_mode',
            styles: [
                'ytd-rich-grid-renderer ytd-rich-grid-row { display: contents !important; }',
                'ytd-rich-grid-renderer #contents.ytd-rich-grid-row { display: contents !important; }',
                'ytd-rich-grid-renderer #contents.ytd-rich-grid-renderer { display: grid !important; grid-template-columns: repeat(auto-fill, minmax(max(360px, calc(33.333% - 11px)), 1fr)) !important; gap: 4px 16px !important; }',
                'ytd-rich-grid-renderer #contents.ytd-rich-grid-renderer > ytd-rich-item-renderer { width: 100% !important; max-width: none !important; min-width: 0 !important; margin: 0 !important; }',
                'ytd-rich-grid-renderer #contents.ytd-rich-grid-renderer > ytd-rich-section-renderer { grid-column: 1 / -1 !important; }',
                'ytd-rich-grid-renderer #contents.ytd-rich-grid-renderer > ytd-rich-item-renderer .ytLockupViewModelHost { display: flex !important; flex-direction: row !important; gap: 12px !important; align-items: flex-start !important; margin: 0 !important; }',
                'ytd-rich-grid-renderer #contents.ytd-rich-grid-renderer > ytd-rich-item-renderer .ytLockupViewModelContentImage { flex: 0 0 180px !important; width: 180px !important; max-width: 180px !important; margin: 0 !important; }',
                'ytd-rich-grid-renderer #contents.ytd-rich-grid-renderer > ytd-rich-item-renderer .ytThumbnailViewModelHost { width: 100% !important; height: auto !important; }',
                'ytd-rich-grid-renderer #contents.ytd-rich-grid-renderer > ytd-rich-item-renderer .ytLockupViewModelMetadata { flex: 1 1 auto !important; min-width: 0 !important; }',
                'ytd-rich-grid-renderer #contents.ytd-rich-grid-renderer > ytd-rich-item-renderer .ytLockupMetadataViewModelAvatar { display: none !important; }',
                'ytd-rich-grid-renderer #contents.ytd-rich-grid-renderer > ytd-rich-item-renderer .ytLockupMetadataViewModelTitle { display: -webkit-box !important; -webkit-line-clamp: 2 !important; -webkit-box-orient: vertical !important; overflow: hidden !important; }',
                'ytd-search ytd-item-section-renderer #contents.ytd-item-section-renderer { display: grid !important; grid-template-columns: repeat(auto-fill, minmax(max(360px, calc(33.333% - 11px)), 1fr)) !important; gap: 8px 16px !important; grid-auto-flow: row dense !important; align-items: start !important; }',
                'ytd-search ytd-item-section-renderer #contents.ytd-item-section-renderer > ytd-shelf-renderer { grid-column: 1 / -1 !important; }',
                'ytd-search ytd-item-section-renderer #contents.ytd-item-section-renderer > ytd-horizontal-card-list-renderer { grid-column: 1 / -1 !important; }',
                'ytd-search ytd-item-section-renderer #contents.ytd-item-section-renderer > ytd-reel-shelf-renderer { grid-column: 1 / -1 !important; }',
                'ytd-search ytd-channel-renderer #content-section { align-items: center !important; }',
                'ytd-search ytd-channel-renderer #avatar-section { width: auto !important; min-width: 0 !important; margin: 0 12px 0 0 !important; }',
                'ytd-search ytd-channel-renderer #avatar { width: 64px !important; height: 64px !important; min-width: 64px !important; }',
                'ytd-search ytd-channel-renderer #avatar img { width: 64px !important; height: 64px !important; }',
                'ytd-search ytd-channel-renderer #info-section { min-width: 0 !important; flex: 1 1 auto !important; }',
                'ytd-search ytd-channel-renderer #channel-title #text { white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; }',
                'ytd-search ytd-channel-renderer #description { display: none !important; }',
                'ytd-search ytd-channel-renderer #buttons { display: none !important; }',
                'ytd-search ytd-video-renderer { width: 100% !important; margin: 0 !important; }',
                'ytd-search ytd-video-renderer ytd-thumbnail { flex: 0 0 180px !important; width: 180px !important; min-width: 180px !important; max-width: 180px !important; margin: 0 12px 0 0 !important; }',
                'ytd-search ytd-video-renderer ytd-thumbnail a#thumbnail { width: 180px !important; height: auto !important; aspect-ratio: 16 / 9 !important; }',
                'ytd-search ytd-video-renderer .metadata-snippet-container { display: none !important; }',
                'ytd-search ytd-video-renderer .metadata-snippet-container-one-line { display: none !important; }',
                'ytd-search ytd-video-renderer #channel-thumbnail { display: none !important; }',
                'ytd-search ytd-video-renderer #expandable-metadata { display: none !important; }',
                'ytd-search ytd-video-renderer a#video-title { display: -webkit-box !important; -webkit-line-clamp: 2 !important; -webkit-box-orient: vertical !important; overflow: hidden !important; white-space: normal !important; }',
                'ytd-search yt-lockup-view-model .ytLockupViewModelContentImage { flex: 0 0 180px !important; width: 180px !important; max-width: 180px !important; }',
                'ytd-channel-renderer.ytd-item-section-renderer { margin: 40px 0!important; }',
                'ytd-watch-next-secondary-results-renderer yt-lockup-view-model { margin-bottom: 8px !important; }',
                'ytd-watch-next-secondary-results-renderer yt-lockup-view-model .ytLockupViewModelContentImage { flex: 0 0 160px !important; width: 160px !important; max-width: 160px !important; }',
                'ytd-watch-next-secondary-results-renderer yt-lockup-view-model .ytThumbnailViewModelHost { width: 100% !important; height: auto !important; }',
                'ytd-watch-next-secondary-results-renderer yt-lockup-view-model .ytLockupMetadataViewModelAvatar { display: none !important; }',
                'ytd-watch-next-secondary-results-renderer yt-lockup-view-model .ytLockupMetadataViewModelTitle { display: -webkit-box !important; -webkit-line-clamp: 2 !important; -webkit-box-orient: vertical !important; overflow: hidden !important; }',
            ],
        }),
    ]),
    section('content_blocks', [
        feature({
            id: 'hideShorts',
            title: 'hide_shorts_sections',
            hide: [
                '#player-container-wrapper',
                '.ytd-video-preview',
                'grid-shelf-view-model:has(ytm-shorts-lockup-view-model-v2)',
                'ytd-reel-shelf-renderer:has(ytm-shorts-lockup-view-model-v2)',
                GHOST_GRID_SKELETON,
            ],
        }),
        feature({
            id: 'hideNewsSection',
            title: 'hide_explore_and_news',
            url: [UrlRegExps.Home],
            hide: [
                'ytd-rich-section-renderer:has(#rich-shelf-header):not(:has(.shortsLockupViewModelHostThumbnail))',
            ],
        }),
        feature({
            id: 'hideHoverPreview',
            title: 'disable_auto_preview_on_hover',
            isNew: true,
            custom: true,
        }),
        feature({
            id: 'hideJams',
            title: 'hide_mixes_and_playlists',
            isNew: true,
            hide: [
                'ytd-rich-item-renderer:has(.yt-lockup-view-model-wiz--collection-stack-2)',
                'ytd-rich-item-renderer:has(yt-collections-stack)',
                'yt-lockup-view-model:has(a[href*="/playlist"])',
                'yt-lockup-view-model:has(yt-collection-thumbnail-view-model)',
                'ytd-rich-item-renderer:has(yt-lockup-view-model:has(a[href*="/playlist"]))',
                GHOST_GRID_SKELETON,
            ],
        }),
    ]),
    section('search', { isNew: true }, [
        feature({
            id: 'hideSearchRefinements',
            title: 'hide_related_searches',
            url: [UrlRegExps.Search],
            hide: [
                'ytd-horizontal-card-list-renderer[is-search]:has(ytd-search-refinement-card-renderer)',
            ],
        }),
        feature({
            id: 'hideSearchInfoCard',
            url: [UrlRegExps.Search],
            title: 'hide_search_info_card',
            hide: ['ytd-secondary-search-container-renderer'],
        }),
        feature({
            id: 'hideSearchChannelShelf',
            url: [UrlRegExps.Search],
            title: 'hide_channel_video_shelf',
            hide: [
                'ytd-shelf-renderer:has(ytd-video-renderer[is-search])',
                'ytd-shelf-renderer:has(yt-horizontal-list-renderer)',
            ],
        }),
    ]),
    section('ads', [
        feature({
            id: 'adsYoutubeBanner',
            title: 'hide_youtube_banners',
            hide: [
                'ytd-banner-promo-renderer',
                'ytd-rich-section-renderer:has(ytd-brand-video-shelf-renderer)',
                'ytd-rich-section-renderer:has(ytd-statement-banner-renderer)',
                '#player-ads',
            ],
        }),
        feature({
            id: 'adsFeedVideo',
            title: 'hide_sponsored_feed_video',
            hide: [
                'ytd-rich-item-renderer:has(ytd-ad-slot-renderer)',
                'ytd-ad-slot-renderer',
                'ytd-search-pyv-renderer',
                GHOST_GRID_SKELETON,
            ],
        }),
        feature({
            id: 'adsInfoPanel',
            title: 'hide_ad_info_panels',
            isNew: true,
            url: [UrlRegExps.Watch],
            hide: ['ytd-engagement-panel-section-list-renderer[target-id]'],
        }),
        feature({
            id: 'autoSkipAds',
            title: 'auto_skip_ads',
            isExperimental: true,
            url: [UrlRegExps.Watch],
            custom: {
                enable: enableAutoSkipAds,
                disable: disableAutoSkipAds,
            },
        }),
    ]),
]);

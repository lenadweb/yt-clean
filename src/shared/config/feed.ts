import { category, feature, section } from 'src/shared/featureConfig/dsl';

export const feedCategory = category('feed_and_recommendations', [
    section('content_blocks', [
        feature({
            id: 'hideShorts',
            title: 'hide_shorts_sections',
            hide: [
                '#player-container-wrapper',
                '.ytd-video-preview',
                'grid-shelf-view-model:has(ytm-shorts-lockup-view-model-v2)',
            ],
        }),
        feature({
            id: 'hideNewsSection',
            title: 'hide_explore_and_news',
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
                '.ytd-rich-item-renderer:has(yt-collections-stack)',
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
                'ytd-search-pyv-renderer',
            ],
        }),
    ]),
]);

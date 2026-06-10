import { defineCategory } from 'src/shared/featureConfig/dsl';

const feed = defineCategory('feed_and_recommendations');
const contentBlocks = feed.section('content_blocks');
const ads = feed.section('ads');

export const feedFeatures = [
    contentBlocks.feature({
        id: 'hideShorts',
        title: 'hide_shorts_sections',
        hide: [
            '#player-container-wrapper',
            '.ytd-video-preview',
            'grid-shelf-view-model:has(ytm-shorts-lockup-view-model-v2)',
        ],
    }),
    contentBlocks.feature({
        id: 'hideNewsSection',
        title: 'hide_explore_and_news',
        hide: [
            'ytd-rich-section-renderer:has(#rich-shelf-header):not(:has(.shortsLockupViewModelHostThumbnail))',
        ],
    }),
    contentBlocks.feature({
        id: 'hideHoverPreview',
        title: 'disable_auto_preview_on_hover',
        isNew: true,
        custom: true,
    }),
    contentBlocks.feature({
        id: 'hideJams',
        title: 'hide_mixes_and_playlists',
        hide: [
            'ytd-rich-item-renderer:has(.yt-lockup-view-model-wiz--collection-stack-2)',
        ],
    }),
    ads.feature({
        id: 'adsYoutubeBanner',
        title: 'hide_youtube_banners',
        hide: [
            'ytd-banner-promo-renderer',
            'ytd-rich-section-renderer:has(ytd-brand-video-shelf-renderer)',
            'ytd-rich-section-renderer:has(ytd-statement-banner-renderer)',
        ],
    }),
    ads.feature({
        id: 'adsFeedVideo',
        title: 'hide_sponsored_feed_video',
        hide: [
            'ytd-rich-item-renderer:has(ytd-ad-slot-renderer)',
            'ytd-search-pyv-renderer',
        ],
    }),
];

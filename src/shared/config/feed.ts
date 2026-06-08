import { IFeatureDraft } from 'src/shared/types/config';
import {
    createFeature,
    customAction,
    hideAction,
} from 'src/shared/config/helpers';

const feed = 'feed_and_recommendations';

const contentBlockFeature = createFeature(feed, 'content_blocks');
const adsFeature = createFeature(feed, 'ads');

export const feedFeatures: IFeatureDraft[] = [
    contentBlockFeature({
        titleKey: 'hide_shorts_sections',
        id: 'hideShorts',
        actions: [
            hideAction(['#player-container-wrapper', '.ytd-video-preview']),
        ],
    }),
    contentBlockFeature({
        titleKey: 'hide_explore_and_news',
        id: 'hideNewsSection',
        actions: [
            hideAction([
                'ytd-rich-section-renderer:has(#rich-shelf-header):not(:has(.shortsLockupViewModelHostThumbnail))',
            ]),
        ],
    }),
    contentBlockFeature({
        titleKey: 'disable_auto_preview_on_hover',
        isNew: true,
        id: 'hideHoverPreview',
        actions: [customAction()],
    }),
    contentBlockFeature({
        titleKey: 'hide_mixes_and_playlists',
        id: 'hideJams',
        actions: [
            hideAction([
                'ytd-rich-item-renderer:has(.yt-lockup-view-model-wiz--collection-stack-2)',
            ]),
        ],
    }),
    adsFeature({
        titleKey: 'hide_youtube_banners',
        id: 'adsYoutubeBanner',
        actions: [
            hideAction([
                'ytd-banner-promo-renderer',
                'ytd-rich-section-renderer:has(ytd-brand-video-shelf-renderer)',
                'ytd-rich-section-renderer:has(ytd-statement-banner-renderer)',
            ]),
        ],
    }),
    adsFeature({
        titleKey: 'hide_sponsored_feed_video',
        id: 'adsFeedVideo',
        actions: [
            hideAction(['ytd-rich-item-renderer:has(ytd-ad-slot-renderer)']),
            hideAction(['ytd-search-pyv-renderer']),
        ],
    }),
];

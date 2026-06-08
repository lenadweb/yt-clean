import { IFeatureDraft } from 'src/shared/types/config';
import {
    createFeature,
    customAction,
    hideAction,
} from 'src/shared/config/helpers';

const feed = 'Feed & Recommendations';

const contentBlockFeature = createFeature(feed, 'Content blocks');
const adsFeature = createFeature(feed, 'Ads');

export const feedFeatures: IFeatureDraft[] = [
    contentBlockFeature({
        title: 'Hide Shorts sections',
        storageKey: 'hideShorts',
        actions: [
            hideAction(['#player-container-wrapper', '.ytd-video-preview']),
        ],
    }),
    contentBlockFeature({
        title: 'Hide Explore & News',
        storageKey: 'hideNewsSection',
        actions: [
            hideAction([
                'ytd-rich-section-renderer:has(#rich-shelf-header):not(:has(.shortsLockupViewModelHostThumbnail))',
            ]),
        ],
    }),
    contentBlockFeature({
        title: 'Disable auto-preview on hover',
        isNew: true,
        storageKey: 'hideHoverPreview',
        actions: [customAction()],
    }),
    contentBlockFeature({
        title: 'Hide Mixes & Playlists',
        storageKey: 'hideJams',
        actions: [
            hideAction([
                'ytd-rich-item-renderer:has(.yt-lockup-view-model-wiz--collection-stack-2)',
            ]),
        ],
    }),
    adsFeature({
        title: 'Hide YouTube Banners',
        storageKey: 'adsYoutubeBanner',
        actions: [
            hideAction([
                'ytd-banner-promo-renderer',
                'ytd-rich-section-renderer:has(ytd-brand-video-shelf-renderer)',
                'ytd-rich-section-renderer:has(ytd-statement-banner-renderer)',
            ]),
        ],
    }),
    adsFeature({
        title: 'Hide Sponsored feed video',
        storageKey: 'adsFeedVideo',
        actions: [
            hideAction(['ytd-rich-item-renderer:has(ytd-ad-slot-renderer)']),
            hideAction(['ytd-search-pyv-renderer']),
        ],
    }),
];

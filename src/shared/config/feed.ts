import {
    ElementActions,
    IAttrAction,
    ISettingsBlock,
} from 'src/shared/types/config';
import { getAttr } from 'src/shared/utils/getAttr';

export const feedConfig: ISettingsBlock<IAttrAction[]> = {
    title: 'Feed & Recommendations',
    settings: [
        {
            title: 'Content blocks',
            groups: [
                {
                    title: 'Hide Shorts sections',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('hide-shorts'),
                            selectors: [
                                '#player-container-wrapper',
                                '.ytd-video-preview',
                            ],
                        },
                    ],
                    storageKey: 'hideShorts',
                },
                {
                    title: 'Hide Explore & News',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('hide-news-section'),
                            selectors: [
                                'ytd-rich-section-renderer:has(#rich-shelf-header):not(:has(.shortsLockupViewModelHostThumbnail))',
                            ],
                        },
                    ],
                    storageKey: 'hideNewsSection',
                },
                {
                    title: 'Disable auto-preview on hover',
                    isNew: true,
                    actions: [
                        {
                            action: ElementActions.custom,
                            attr: getAttr('hide-hover-preview'),
                            selectors: [],
                        },
                    ],
                    storageKey: 'hideHoverPreview',
                },
                {
                    title: 'Hide Mixes & Playlists',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('hide-jams'),
                            selectors: [
                                'ytd-rich-item-renderer:has(.yt-lockup-view-model-wiz--collection-stack-2)',
                            ],
                        },
                    ],
                    storageKey: 'hideJams',
                },
            ],
        },
        {
            title: 'Ads',
            groups: [
                {
                    title: 'Hide YouTube Banners',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('youtube-banners'),
                            selectors: [
                                'ytd-banner-promo-renderer',
                                'ytd-rich-section-renderer:has(ytd-brand-video-shelf-renderer)',
                                'ytd-rich-section-renderer:has(ytd-statement-banner-renderer)',
                            ],
                        },
                    ],
                    storageKey: 'adsYoutubeBanner',
                },
                {
                    title: 'Hide Sponsored feed video',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('sponsored-feed-video'),
                            selectors: [
                                'ytd-rich-item-renderer:has(ytd-ad-slot-renderer)',
                            ],
                        },
                        {
                            action: ElementActions.hide,
                            attr: getAttr('sponsored-search'),
                            selectors: ['ytd-search-pyv-renderer'],
                        },
                    ],
                    storageKey: 'adsFeedVideo',
                },
            ],
        },
    ],
};

import { IFeatureDraft } from 'src/shared/types/config';
import {
    createFeature,
    hideAction,
    stylesAction,
} from 'src/shared/config/helpers';

const sidebar = 'sidebar';

const hideSidebarFeature = createFeature(sidebar, 'hide_sidebar_completely', {
    isNew: true,
    withoutCheckboxes: true,
});
const mainMenuFeature = createFeature(sidebar, 'main_menu', {
    withoutSwitch: true,
});
const youFeature = createFeature(sidebar, 'you');
const subscriptionsFeature = createFeature(sidebar, 'hide_subscriptions_list', {
    withoutCheckboxes: true,
});
const exploreFeature = createFeature(sidebar, 'explore');
const moreFromYoutubeFeature = createFeature(sidebar, 'more_from_youtube');

export const sidebarFeatures: IFeatureDraft[] = [
    hideSidebarFeature({
        titleKey: 'hide_sidebar_completely',
        id: 'hideSidebar',
        actions: [
            hideAction([
                'tp-yt-app-drawer#guide',
                'ytd-mini-guide-renderer',
                '#guide-button',
            ]),
            stylesAction([
                `#page-manager {
                    margin-left: 12px !important;
                }`,
            ]),
        ],
    }),
    mainMenuFeature({
        titleKey: 'hide_shorts',
        id: 'hideMenuShorts',
        actions: [
            hideAction([
                'ytd-mini-guide-entry-renderer[aria-label=Shorts]',
                '#sections #items > ytd-guide-entry-renderer:has([title=Shorts])',
            ]),
        ],
    }),
    youFeature({
        titleKey: 'hide_history',
        id: 'hideMenuHistory',
        ui: {
            onFullGroupEnabledActions: [
                hideAction([
                    '#sections ytd-guide-collapsible-section-entry-renderer:has([href="/feed/history"])',
                ]),
            ],
        },
        actions: [
            hideAction([
                '#section-items ytd-guide-entry-renderer:has([href="/feed/history"])',
            ]),
        ],
    }),
    youFeature({
        titleKey: 'hide_playlists',
        id: 'hideMenuPlaylists',
        actions: [
            hideAction([
                '#section-items ytd-guide-entry-renderer:has([href="/feed/playlists"])',
            ]),
        ],
    }),
    youFeature({
        titleKey: 'hide_your_video',
        id: 'hideMenuYourVideo',
        actions: [
            hideAction([
                '#section-items ytd-guide-entry-renderer:has([href*="studio.youtube"])',
            ]),
        ],
    }),
    youFeature({
        titleKey: 'hide_watch_later',
        id: 'hideMenuWatchLater',
        actions: [
            hideAction([
                '#section-items ytd-guide-entry-renderer:has([href="/playlist?list=WL"])',
            ]),
        ],
    }),
    youFeature({
        titleKey: 'hide_liked_videos',
        id: 'hideMenuLikedVideos',
        actions: [
            hideAction([
                '#section-items ytd-guide-entry-renderer:has([href="/playlist?list=LL"])',
            ]),
        ],
    }),
    youFeature({
        titleKey: 'your_movies',
        id: 'hideYourMovies',
        actions: [
            hideAction([
                '#section-items ytd-guide-entry-renderer:has([href*="/feed/storefront"])',
            ]),
        ],
    }),
    subscriptionsFeature({
        titleKey: 'hide_subscriptions_list',
        id: 'hideMenuSubscriptionsList',
        actions: [
            hideAction([
                "#sections ytd-guide-section-renderer:has([href*='@'])",
                "ytd-mini-guide-renderer ytd-mini-guide-entry-renderer:has([href='/feed/subscriptions'])",
            ]),
        ],
    }),
    exploreFeature({
        titleKey: 'hide_trending',
        id: 'hideMenuExploreTrending',
        ui: {
            onFullGroupEnabledActions: [
                hideAction([
                    "#sections ytd-guide-section-renderer:has([href*='feed/trending'])",
                ]),
            ],
        },
        actions: [
            hideAction([
                "#sections ytd-guide-entry-renderer:has([href*='feed/trending'])",
            ]),
        ],
    }),
    exploreFeature({
        titleKey: 'hide_music',
        id: 'hideMenuExploreMusic',
        actions: [
            hideAction([
                "#sections ytd-guide-entry-renderer:has([href*='channel/UC-9'])",
            ]),
        ],
    }),
    exploreFeature({
        titleKey: 'hide_gaming',
        id: 'hideMenuExploreGaming',
        actions: [
            hideAction([
                "#sections ytd-guide-entry-renderer:has([href='/gaming'])",
            ]),
        ],
    }),
    exploreFeature({
        titleKey: 'hide_news',
        id: 'hideMenuExploreNews',
        actions: [
            hideAction([
                "#sections ytd-guide-entry-renderer:has([href*='UCYfdidRxbB8Qhf0Nx7ioOYw'])",
            ]),
        ],
    }),
    exploreFeature({
        titleKey: 'hide_sports',
        id: 'hideMenuExploreSports',
        actions: [
            hideAction([
                "#sections ytd-guide-entry-renderer:has([href*='UCEgdi0XIXXZ-qJOFPf4JSKw'])",
            ]),
        ],
    }),
    moreFromYoutubeFeature({
        titleKey: 'hide_youtube_premium',
        id: 'hideMenuMorePremium',
        ui: {
            onFullGroupEnabledActions: [
                hideAction([
                    "#sections ytd-guide-section-renderer:has([href='https://music.youtube.com/'])",
                ]),
            ],
        },
        actions: [
            hideAction([
                "#sections #items ytd-guide-entry-renderer:has([href='/premium'])",
            ]),
        ],
    }),
    moreFromYoutubeFeature({
        titleKey: 'hide_youtube_music',
        id: 'hideMenuMoreMusic',
        actions: [
            hideAction([
                "#sections #items ytd-guide-entry-renderer:has([href='https://music.youtube.com/'])",
            ]),
        ],
    }),
    moreFromYoutubeFeature({
        titleKey: 'hide_youtube_kids',
        id: 'hideMenuMoreKids',
        actions: [
            hideAction([
                "#sections #items ytd-guide-entry-renderer:has([href*='youtubekids.com'])",
            ]),
        ],
    }),
    moreFromYoutubeFeature({
        titleKey: 'hide_youtube_studio',
        id: 'hideMenuMoreStudio',
        actions: [
            hideAction([
                "#sections #items ytd-guide-entry-renderer:has([href*='studio.youtube.com'])",
            ]),
        ],
    }),
];

import { IFeatureDraft } from 'src/shared/types/config';
import {
    createFeature,
    hideAction,
    stylesAction,
} from 'src/shared/config/helpers';

const sidebar = 'Sidebar';

const hideSidebarFeature = createFeature(sidebar, 'Hide sidebar completely', {
    isNew: true,
    withoutCheckboxes: true,
});
const mainMenuFeature = createFeature(sidebar, 'Main menu', {
    withoutSwitch: true,
});
const youFeature = createFeature(sidebar, 'You');
const subscriptionsFeature = createFeature(sidebar, 'Hide Subscriptions list', {
    withoutCheckboxes: true,
});
const exploreFeature = createFeature(sidebar, 'Explore');
const moreFromYoutubeFeature = createFeature(sidebar, 'More from YouTube');

export const sidebarFeatures: IFeatureDraft[] = [
    hideSidebarFeature({
        title: 'Hide sidebar completely',
        storageKey: 'hideSidebar',
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
        title: 'Hide "Shorts"',
        storageKey: 'hideMenuShorts',
        actions: [
            hideAction([
                'ytd-mini-guide-entry-renderer[aria-label=Shorts]',
                '#sections #items > ytd-guide-entry-renderer:has([title=Shorts])',
            ]),
        ],
    }),
    youFeature({
        title: 'Hide "History"',
        storageKey: 'hideMenuHistory',
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
        title: 'Hide "Playlists"',
        storageKey: 'hideMenuPlaylists',
        actions: [
            hideAction([
                '#section-items ytd-guide-entry-renderer:has([href="/feed/playlists"])',
            ]),
        ],
    }),
    youFeature({
        title: 'Hide "Your video"',
        storageKey: 'hideMenuYourVideo',
        actions: [
            hideAction([
                '#section-items ytd-guide-entry-renderer:has([href*="studio.youtube"])',
            ]),
        ],
    }),
    youFeature({
        title: 'Hide "Watch later"',
        storageKey: 'hideMenuWatchLater',
        actions: [
            hideAction([
                '#section-items ytd-guide-entry-renderer:has([href="/playlist?list=WL"])',
            ]),
        ],
    }),
    youFeature({
        title: 'Hide "Liked videos"',
        storageKey: 'hideMenuLikedVideos',
        actions: [
            hideAction([
                '#section-items ytd-guide-entry-renderer:has([href="/playlist?list=LL"])',
            ]),
        ],
    }),
    youFeature({
        title: 'Your "Movies"',
        storageKey: 'hideYourMovies',
        actions: [
            hideAction([
                '#section-items ytd-guide-entry-renderer:has([href*="/feed/storefront"])',
            ]),
        ],
    }),
    subscriptionsFeature({
        title: 'Hide Subscriptions list',
        storageKey: 'hideMenuSubscriptionsList',
        actions: [
            hideAction([
                "#sections ytd-guide-section-renderer:has([href*='@'])",
                "ytd-mini-guide-renderer ytd-mini-guide-entry-renderer:has([href='/feed/subscriptions'])",
            ]),
        ],
    }),
    exploreFeature({
        title: 'Hide "Trending"',
        storageKey: 'hideMenuExploreTrending',
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
        title: 'Hide "Music"',
        storageKey: 'hideMenuExploreMusic',
        actions: [
            hideAction([
                "#sections ytd-guide-entry-renderer:has([href*='channel/UC-9'])",
            ]),
        ],
    }),
    exploreFeature({
        title: 'Hide "Gaming"',
        storageKey: 'hideMenuExploreGaming',
        actions: [
            hideAction([
                "#sections ytd-guide-entry-renderer:has([href='/gaming'])",
            ]),
        ],
    }),
    exploreFeature({
        title: 'Hide "News"',
        storageKey: 'hideMenuExploreNews',
        actions: [
            hideAction([
                "#sections ytd-guide-entry-renderer:has([href*='UCYfdidRxbB8Qhf0Nx7ioOYw'])",
            ]),
        ],
    }),
    exploreFeature({
        title: 'Hide "Sports"',
        storageKey: 'hideMenuExploreSports',
        actions: [
            hideAction([
                "#sections ytd-guide-entry-renderer:has([href*='UCEgdi0XIXXZ-qJOFPf4JSKw'])",
            ]),
        ],
    }),
    moreFromYoutubeFeature({
        title: 'Hide "YouTube Premium"',
        storageKey: 'hideMenuMorePremium',
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
        title: 'Hide "YouTube Music"',
        storageKey: 'hideMenuMoreMusic',
        actions: [
            hideAction([
                "#sections #items ytd-guide-entry-renderer:has([href='https://music.youtube.com/'])",
            ]),
        ],
    }),
    moreFromYoutubeFeature({
        title: 'Hide "YouTube Kids"',
        storageKey: 'hideMenuMoreKids',
        actions: [
            hideAction([
                "#sections #items ytd-guide-entry-renderer:has([href*='youtubekids.com'])",
            ]),
        ],
    }),
    moreFromYoutubeFeature({
        title: 'Hide "YouTube Studio"',
        storageKey: 'hideMenuMoreStudio',
        actions: [
            hideAction([
                "#sections #items ytd-guide-entry-renderer:has([href*='studio.youtube.com'])",
            ]),
        ],
    }),
];

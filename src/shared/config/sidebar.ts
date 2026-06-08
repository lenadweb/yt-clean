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
        title: 'Hide "Shorts"',
        id: 'hideMenuShorts',
        actions: [
            hideAction([
                'ytd-mini-guide-entry-renderer[aria-label=Shorts]',
                '#sections #items > ytd-guide-entry-renderer:has([title=Shorts])',
            ]),
        ],
    }),
    youFeature({
        title: 'Hide "History"',
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
        title: 'Hide "Playlists"',
        id: 'hideMenuPlaylists',
        actions: [
            hideAction([
                '#section-items ytd-guide-entry-renderer:has([href="/feed/playlists"])',
            ]),
        ],
    }),
    youFeature({
        title: 'Hide "Your video"',
        id: 'hideMenuYourVideo',
        actions: [
            hideAction([
                '#section-items ytd-guide-entry-renderer:has([href*="studio.youtube"])',
            ]),
        ],
    }),
    youFeature({
        title: 'Hide "Watch later"',
        id: 'hideMenuWatchLater',
        actions: [
            hideAction([
                '#section-items ytd-guide-entry-renderer:has([href="/playlist?list=WL"])',
            ]),
        ],
    }),
    youFeature({
        title: 'Hide "Liked videos"',
        id: 'hideMenuLikedVideos',
        actions: [
            hideAction([
                '#section-items ytd-guide-entry-renderer:has([href="/playlist?list=LL"])',
            ]),
        ],
    }),
    youFeature({
        title: 'Your "Movies"',
        id: 'hideYourMovies',
        actions: [
            hideAction([
                '#section-items ytd-guide-entry-renderer:has([href*="/feed/storefront"])',
            ]),
        ],
    }),
    subscriptionsFeature({
        title: 'Hide Subscriptions list',
        id: 'hideMenuSubscriptionsList',
        actions: [
            hideAction([
                "#sections ytd-guide-section-renderer:has([href*='@'])",
                "ytd-mini-guide-renderer ytd-mini-guide-entry-renderer:has([href='/feed/subscriptions'])",
            ]),
        ],
    }),
    exploreFeature({
        title: 'Hide "Trending"',
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
        title: 'Hide "Music"',
        id: 'hideMenuExploreMusic',
        actions: [
            hideAction([
                "#sections ytd-guide-entry-renderer:has([href*='channel/UC-9'])",
            ]),
        ],
    }),
    exploreFeature({
        title: 'Hide "Gaming"',
        id: 'hideMenuExploreGaming',
        actions: [
            hideAction([
                "#sections ytd-guide-entry-renderer:has([href='/gaming'])",
            ]),
        ],
    }),
    exploreFeature({
        title: 'Hide "News"',
        id: 'hideMenuExploreNews',
        actions: [
            hideAction([
                "#sections ytd-guide-entry-renderer:has([href*='UCYfdidRxbB8Qhf0Nx7ioOYw'])",
            ]),
        ],
    }),
    exploreFeature({
        title: 'Hide "Sports"',
        id: 'hideMenuExploreSports',
        actions: [
            hideAction([
                "#sections ytd-guide-entry-renderer:has([href*='UCEgdi0XIXXZ-qJOFPf4JSKw'])",
            ]),
        ],
    }),
    moreFromYoutubeFeature({
        title: 'Hide "YouTube Premium"',
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
        title: 'Hide "YouTube Music"',
        id: 'hideMenuMoreMusic',
        actions: [
            hideAction([
                "#sections #items ytd-guide-entry-renderer:has([href='https://music.youtube.com/'])",
            ]),
        ],
    }),
    moreFromYoutubeFeature({
        title: 'Hide "YouTube Kids"',
        id: 'hideMenuMoreKids',
        actions: [
            hideAction([
                "#sections #items ytd-guide-entry-renderer:has([href*='youtubekids.com'])",
            ]),
        ],
    }),
    moreFromYoutubeFeature({
        title: 'Hide "YouTube Studio"',
        id: 'hideMenuMoreStudio',
        actions: [
            hideAction([
                "#sections #items ytd-guide-entry-renderer:has([href*='studio.youtube.com'])",
            ]),
        ],
    }),
];

import { IFeatureConfig } from 'src/shared/types/config';
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

export const sidebarFeatures: IFeatureConfig[] = [
    hideSidebarFeature({
        title: 'Hide sidebar completely',
        storageKey: 'hideSidebar',
        actions: [
            hideAction('hide-sidebar', [
                'tp-yt-app-drawer#guide',
                'ytd-mini-guide-renderer',
                '#guide-button',
            ]),
            stylesAction('hide-sidebar', [
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
            hideAction('hide-menu-shorts', [
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
                hideAction('full-group-you', [
                    '#sections ytd-guide-collapsible-section-entry-renderer:has([href="/feed/history"])',
                ]),
            ],
        },
        actions: [
            hideAction('hide-menu-history', [
                '#section-items ytd-guide-entry-renderer:has([href="/feed/history"])',
            ]),
        ],
    }),
    youFeature({
        title: 'Hide "Playlists"',
        storageKey: 'hideMenuPlaylists',
        actions: [
            hideAction('hide-menu-playlists', [
                '#section-items ytd-guide-entry-renderer:has([href="/feed/playlists"])',
            ]),
        ],
    }),
    youFeature({
        title: 'Hide "Your video"',
        storageKey: 'hideMenuYourVideo',
        actions: [
            hideAction('hide-menu-your-video', [
                '#section-items ytd-guide-entry-renderer:has([href*="studio.youtube"])',
            ]),
        ],
    }),
    youFeature({
        title: 'Hide "Watch later"',
        storageKey: 'hideMenuWatchLater',
        actions: [
            hideAction('hide-menu-watch-later', [
                '#section-items ytd-guide-entry-renderer:has([href="/playlist?list=WL"])',
            ]),
        ],
    }),
    youFeature({
        title: 'Hide "Liked videos"',
        storageKey: 'hideMenuLikedVideos',
        actions: [
            hideAction('hide-menu-liked-videos', [
                '#section-items ytd-guide-entry-renderer:has([href="/playlist?list=LL"])',
            ]),
        ],
    }),
    youFeature({
        title: 'Your "Movies"',
        storageKey: 'hideYourMovies',
        actions: [
            hideAction('hide-your-movies', [
                '#section-items ytd-guide-entry-renderer:has([href*="/feed/storefront"])',
            ]),
        ],
    }),
    subscriptionsFeature({
        title: 'Hide Subscriptions list',
        storageKey: 'hideMenuSubscriptionsList',
        actions: [
            hideAction('hide-menu-subscriptions-list', [
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
                hideAction('explore-group', [
                    "#sections ytd-guide-section-renderer:has([href*='feed/trending'])",
                ]),
            ],
        },
        actions: [
            hideAction('hide-menu-explore-trending', [
                "#sections ytd-guide-entry-renderer:has([href*='feed/trending'])",
            ]),
        ],
    }),
    exploreFeature({
        title: 'Hide "Music"',
        storageKey: 'hideMenuExploreMusic',
        actions: [
            hideAction('hide-menu-explore-music', [
                "#sections ytd-guide-entry-renderer:has([href*='channel/UC-9'])",
            ]),
        ],
    }),
    exploreFeature({
        title: 'Hide "Gaming"',
        storageKey: 'hideMenuExploreGaming',
        actions: [
            hideAction('hide-menu-explore-gaming', [
                "#sections ytd-guide-entry-renderer:has([href='/gaming'])",
            ]),
        ],
    }),
    exploreFeature({
        title: 'Hide "News"',
        storageKey: 'hideMenuExploreNews',
        actions: [
            hideAction('hide-menu-explore-news', [
                "#sections ytd-guide-entry-renderer:has([href*='UCYfdidRxbB8Qhf0Nx7ioOYw'])",
            ]),
        ],
    }),
    exploreFeature({
        title: 'Hide "Sports"',
        storageKey: 'hideMenuExploreSports',
        actions: [
            hideAction('hide-menu-explore-sports', [
                "#sections ytd-guide-entry-renderer:has([href*='UCEgdi0XIXXZ-qJOFPf4JSKw'])",
            ]),
        ],
    }),
    moreFromYoutubeFeature({
        title: 'Hide "YouTube Premium"',
        storageKey: 'hideMenuMorePremium',
        ui: {
            onFullGroupEnabledActions: [
                hideAction('more-from-yt-group', [
                    "#sections ytd-guide-section-renderer:has([href='https://music.youtube.com/'])",
                ]),
            ],
        },
        actions: [
            hideAction('hide-menu-more-premium', [
                "#sections #items ytd-guide-entry-renderer:has([href='/premium'])",
            ]),
        ],
    }),
    moreFromYoutubeFeature({
        title: 'Hide "YouTube Music"',
        storageKey: 'hideMenuMoreMusic',
        actions: [
            hideAction('hide-menu-more-music', [
                "#sections #items ytd-guide-entry-renderer:has([href='https://music.youtube.com/'])",
            ]),
        ],
    }),
    moreFromYoutubeFeature({
        title: 'Hide "YouTube Kids"',
        storageKey: 'hideMenuMoreKids',
        actions: [
            hideAction('hide-menu-more-kids', [
                "#sections #items ytd-guide-entry-renderer:has([href*='youtubekids.com'])",
            ]),
        ],
    }),
    moreFromYoutubeFeature({
        title: 'Hide "YouTube Studio"',
        storageKey: 'hideMenuMoreStudio',
        actions: [
            hideAction('hide-menu-more-studio', [
                "#sections #items ytd-guide-entry-renderer:has([href*='studio.youtube.com'])",
            ]),
        ],
    }),
];

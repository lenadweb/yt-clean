import {
    ElementActions,
    IAttrAction,
    ISettingsBlock,
} from 'src/shared/types/config';
import { getAttr } from 'src/shared/utils/getAttr';

export const sidebarConfig: ISettingsBlock<IAttrAction[]> = {
    title: 'Sidebar',
    settings: [
        {
            title: 'Main menu',
            groups: [
                {
                    title: 'Shorts',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('hide-menu-shorts'),
                            selectors: [
                                'ytd-mini-guide-entry-renderer[aria-label=Shorts]',
                                '#sections #items > ytd-guide-entry-renderer:has([title=Shorts])',
                            ],
                        },
                    ],
                    storageKey: 'hideMenuShorts',
                },
            ],
            withoutSwitch: true,
        },
        {
            title: 'You',
            // #sections > ytd-guide-section-renderer:has([href*='feed/trending'])
            groups: [
                {
                    title: 'History',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('hide-menu-history'),
                            selectors: [
                                '#section-items ytd-guide-entry-renderer:has([href="/feed/history"])',
                            ],
                        },
                    ],
                    storageKey: 'hideMenuHistory',
                },
                {
                    title: 'Playlists',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('hide-menu-playlists'),
                            selectors: [
                                '#section-items ytd-guide-entry-renderer:has([href="/feed/playlists"])',
                            ],
                        },
                    ],
                    storageKey: 'hideMenuPlaylists',
                },
                {
                    title: 'Your video',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('hide-menu-your-video'),
                            selectors: [
                                '#section-items ytd-guide-entry-renderer:has([href*="studio.youtube"])',
                            ],
                        },
                    ],
                    storageKey: 'hideMenuYourVideo',
                },
                {
                    title: 'Watch later',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('hide-menu-watch-later'),
                            selectors: [
                                '#section-items ytd-guide-entry-renderer:has([href="/playlist?list=WL"])',
                            ],
                        },
                    ],
                    storageKey: 'hideMenuWatchLater',
                },
                {
                    title: 'Liked videos',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('hide-menu-liked-videos'),
                            selectors: [
                                '#section-items ytd-guide-entry-renderer:has([href="/playlist?list=LL"])',
                            ],
                        },
                    ],
                    storageKey: 'hideMenuLikedVideos',
                },
                {
                    title: 'Your Movies',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('hide-your-movies'),
                            selectors: [
                                '#section-items ytd-guide-entry-renderer:has([href*="/feed/storefront"])',
                            ],
                        },
                    ],
                    storageKey: 'hideYourMovies',
                },
            ],
            onFullGroupEnabledActions: [
                {
                    action: ElementActions.hide,
                    attr: getAttr('full-group-you'),
                    selectors: [
                        '#sections ytd-guide-collapsible-section-entry-renderer:has([href="/feed/history"])',
                    ],
                },
            ],
        },
        {
            title: 'Subscriptions list',
            groups: [
                {
                    title: 'Subscriptions list',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('hide-menu-subscriptions-list'),
                            selectors: [
                                "#sections ytd-guide-section-renderer:has([href*='@'])",
                                "ytd-mini-guide-renderer ytd-mini-guide-entry-renderer:has([href='/feed/subscriptions'])",
                            ],
                        },
                    ],
                    storageKey: 'hideMenuSubscriptionsList',
                },
            ],
            withoutCheckboxes: true,
        },
        {
            title: 'Explore',
            groups: [
                {
                    title: 'Trending',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('hide-menu-explore-trending'),
                            selectors: [
                                "#sections ytd-guide-entry-renderer:has([href*='feed/trending'])",
                            ],
                        },
                    ],
                    storageKey: 'hideMenuExploreTrending',
                },
                {
                    title: 'Music',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('hide-menu-explore-music'),
                            selectors: [
                                "#sections ytd-guide-entry-renderer:has([href*='channel/UC-9'])",
                            ],
                        },
                    ],
                    storageKey: 'hideMenuExploreMusic',
                },
                {
                    title: 'Gaming',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('hide-menu-explore-gaming'),
                            selectors: [
                                "#sections ytd-guide-entry-renderer:has([href='/gaming'])",
                            ],
                        },
                    ],
                    storageKey: 'hideMenuExploreGaming',
                },
                {
                    title: 'News',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('hide-menu-explore-news'),
                            selectors: [
                                "#sections ytd-guide-entry-renderer:has([href*='UCYfdidRxbB8Qhf0Nx7ioOYw'])",
                            ],
                        },
                    ],
                    storageKey: 'hideMenuExploreNews',
                },
                {
                    title: 'Sports',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('hide-menu-explore-sports'),
                            selectors: [
                                "#sections ytd-guide-entry-renderer:has([href*='UCEgdi0XIXXZ-qJOFPf4JSKw'])",
                            ],
                        },
                    ],
                    storageKey: 'hideMenuExploreSports',
                },
            ],
            onFullGroupEnabledActions: [
                {
                    action: ElementActions.hide,
                    attr: getAttr('explore-group'),
                    selectors: [
                        "#sections ytd-guide-section-renderer:has([href*='feed/trending'])",
                    ],
                },
            ],
        },
        {
            title: 'More from YouTube',
            groups: [
                {
                    title: 'YouTube Premium',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('hide-menu-more-premium'),
                            selectors: [
                                "#sections #items ytd-guide-entry-renderer:has([href='/premium'])",
                            ],
                        },
                    ],
                    storageKey: 'hideMenuMorePremium',
                },
                {
                    title: 'YouTube Music',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('hide-menu-more-music'),
                            selectors: [
                                "#sections #items ytd-guide-entry-renderer:has([href='https://music.youtube.com/'])",
                            ],
                        },
                    ],
                    storageKey: 'hideMenuMoreMusic',
                },
                {
                    title: 'YouTube Kids',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('hide-menu-more-kids'),
                            selectors: [
                                "#sections #items ytd-guide-entry-renderer:has([href*='youtubekids.com'])",
                            ],
                        },
                    ],
                    storageKey: 'hideMenuMoreKids',
                },
                {
                    title: 'YouTube Studio',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('hide-menu-more-studio'),
                            selectors: [
                                "#sections #items ytd-guide-entry-renderer:has([href*='studio.youtube.com'])",
                            ],
                        },
                    ],
                    storageKey: 'hideMenuMoreStudio',
                },
            ],
            onFullGroupEnabledActions: [
                {
                    action: ElementActions.hide,
                    attr: getAttr('more-from-yt-group'),
                    selectors: [
                        "#sections ytd-guide-section-renderer:has([href='https://music.youtube.com/'])",
                    ],
                },
            ],
        },
    ],
};

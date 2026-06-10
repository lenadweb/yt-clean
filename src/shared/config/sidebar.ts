import { category, feature, section } from 'src/shared/featureConfig/dsl';

export const sidebarCategory = category('sidebar', [
    section('hide_sidebar_completely', { isNew: true, controls: 'switch' }, [
        feature({
            id: 'hideSidebar',
            title: 'hide_sidebar_completely',
            hide: [
                'tp-yt-app-drawer#guide',
                'ytd-mini-guide-renderer',
                '#guide-button',
            ],
            styles: [
                `#page-manager {
                    margin-left: 12px !important;
                }`,
            ],
        }),
    ]),
    section('main_menu', { controls: 'checkboxes' }, [
        feature({
            id: 'hideMenuShorts',
            title: 'hide_shorts',
            hide: [
                'ytd-mini-guide-entry-renderer[aria-label=Shorts]',
                '#sections #items > ytd-guide-entry-renderer:has([title=Shorts])',
            ],
        }),
    ]),
    section(
        'you',
        {
            hideWhenAllEnabled: [
                '#sections ytd-guide-collapsible-section-entry-renderer:has([href="/feed/history"])',
            ],
        },
        [
            feature({
                id: 'hideMenuHistory',
                title: 'hide_history',
                hide: [
                    '#section-items ytd-guide-entry-renderer:has([href="/feed/history"])',
                ],
            }),
            feature({
                id: 'hideMenuPlaylists',
                title: 'hide_playlists',
                hide: [
                    '#section-items ytd-guide-entry-renderer:has([href="/feed/playlists"])',
                ],
            }),
            feature({
                id: 'hideMenuYourVideo',
                title: 'hide_your_video',
                hide: [
                    '#section-items ytd-guide-entry-renderer:has([href*="studio.youtube"])',
                ],
            }),
            feature({
                id: 'hideMenuWatchLater',
                title: 'hide_watch_later',
                hide: [
                    '#section-items ytd-guide-entry-renderer:has([href="/playlist?list=WL"])',
                ],
            }),
            feature({
                id: 'hideMenuLikedVideos',
                title: 'hide_liked_videos',
                hide: [
                    '#section-items ytd-guide-entry-renderer:has([href="/playlist?list=LL"])',
                ],
            }),
            feature({
                id: 'hideYourMovies',
                title: 'your_movies',
                hide: [
                    '#section-items ytd-guide-entry-renderer:has([href*="/feed/storefront"])',
                ],
            }),
        ]
    ),
    section('hide_subscriptions_list', { controls: 'switch' }, [
        feature({
            id: 'hideMenuSubscriptionsList',
            title: 'hide_subscriptions_list',
            hide: [
                "#sections ytd-guide-section-renderer:has([href*='@'])",
                "ytd-mini-guide-renderer ytd-mini-guide-entry-renderer:has([href='/feed/subscriptions'])",
            ],
        }),
    ]),
    section(
        'explore',
        {
            hideWhenAllEnabled: [
                "#sections ytd-guide-section-renderer:has([href*='feed/trending'])",
            ],
        },
        [
            feature({
                id: 'hideMenuExploreTrending',
                title: 'hide_trending',
                hide: [
                    "#sections ytd-guide-entry-renderer:has([href*='feed/trending'])",
                ],
            }),
            feature({
                id: 'hideMenuExploreMusic',
                title: 'hide_music',
                hide: [
                    "#sections ytd-guide-entry-renderer:has([href*='channel/UC-9'])",
                ],
            }),
            feature({
                id: 'hideMenuExploreGaming',
                title: 'hide_gaming',
                hide: [
                    "#sections ytd-guide-entry-renderer:has([href='/gaming'])",
                ],
            }),
            feature({
                id: 'hideMenuExploreNews',
                title: 'hide_news',
                hide: [
                    "#sections ytd-guide-entry-renderer:has([href*='UCYfdidRxbB8Qhf0Nx7ioOYw'])",
                ],
            }),
            feature({
                id: 'hideMenuExploreSports',
                title: 'hide_sports',
                hide: [
                    "#sections ytd-guide-entry-renderer:has([href*='UCEgdi0XIXXZ-qJOFPf4JSKw'])",
                ],
            }),
        ]
    ),
    section(
        'more_from_youtube',
        {
            hideWhenAllEnabled: [
                "#sections ytd-guide-section-renderer:has([href='https://music.youtube.com/'])",
            ],
        },
        [
            feature({
                id: 'hideMenuMorePremium',
                title: 'hide_youtube_premium',
                hide: [
                    "#sections #items ytd-guide-entry-renderer:has([href='/premium'])",
                ],
            }),
            feature({
                id: 'hideMenuMoreMusic',
                title: 'hide_youtube_music',
                hide: [
                    "#sections #items ytd-guide-entry-renderer:has([href='https://music.youtube.com/'])",
                ],
            }),
            feature({
                id: 'hideMenuMoreKids',
                title: 'hide_youtube_kids',
                hide: [
                    "#sections #items ytd-guide-entry-renderer:has([href*='youtubekids.com'])",
                ],
            }),
            feature({
                id: 'hideMenuMoreStudio',
                title: 'hide_youtube_studio',
                hide: [
                    "#sections #items ytd-guide-entry-renderer:has([href*='studio.youtube.com'])",
                ],
            }),
        ]
    ),
]);

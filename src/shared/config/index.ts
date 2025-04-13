import { UrlRegExps } from 'src/shared/const';
import { ElementActions, IConfig } from 'src/shared/types/config';
import { getAttr } from 'src/shared/utils/getAttr';
import { waitForElement } from 'src/shared/utils/dom';
import { clickElement } from 'src/shared/utils/browser';

export const CONFIG: IConfig = {
    domActions: [
        {
            title: 'Sidebar & Navigation',
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
                                    attr: getAttr(
                                        'hide-menu-subscriptions-list'
                                    ),
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
        },
        {
            title: 'Top Panel',
            settings: [
                {
                    title: 'Search Bar',
                    groups: [
                        {
                            title: 'Voice search button',
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr('hide-voice-search'),
                                    selectors: ['#voice-search-button'],
                                },
                            ],
                            storageKey: 'voiceButtonInSearch',
                        },
                        {
                            title: 'Virtual keyboard button',
                            actions: [
                                {
                                    title: 'Virtual keyboard button',
                                    action: ElementActions.hide,
                                    attr: getAttr('hide-virtual-keyboard'),
                                    selectors: [
                                        '.ytSearchboxComponentYtdTextInputAssistantWrapper',
                                    ],
                                },
                            ],
                            storageKey: 'virtualKeyboard',
                        },
                        {
                            title: 'Search tags',
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr('hide-search-tags'),
                                    urlRegExp: [UrlRegExps.Home],
                                    selectors: [
                                        '.ytd-feed-filter-chip-bar-renderer',
                                        '#header.ytd-rich-grid-renderer',
                                        'yt-related-chip-cloud-renderer',
                                    ],
                                },
                            ],
                            storageKey: 'hideSearchTags',
                        },
                    ],
                },
                {
                    title: 'Actions & user',
                    groups: [
                        {
                            title: 'Upload button',
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr('hide-create-video'),
                                    selectors: [
                                        '#buttons .ytd-masthead:first-child',
                                    ],
                                },
                            ],
                            storageKey: 'hideCreateVideo',
                        },
                        {
                            title: 'Notifications',
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr('hide-notification-button'),
                                    selectors: [
                                        'ytd-notification-topbar-button-renderer.ytd-masthead',
                                    ],
                                },
                            ],
                            storageKey: 'notificationButton',
                        },
                    ],
                },
            ],
        },
        {
            title: 'Feed & Recommendations',
            settings: [
                {
                    title: 'Content blocks',
                    groups: [
                        {
                            title: 'Shorts sections',
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr('hide-shorts'),
                                    selectors: [
                                        'ytd-rich-section-renderer:has([is-shorts])',
                                        'ytd-reel-shelf-renderer:has(#left-arrow)',
                                        'ytd-reel-shelf-renderer.ytd-watch-next-secondary-results-renderer',
                                        'ytd-reel-shelf-renderer',
                                    ],
                                },
                            ],
                            storageKey: 'hideShorts',
                        },
                        {
                            title: 'Explore & News',
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
                            title: 'Mixes & Playlists',
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
            ],
        },
        {
            title: 'Video page',
            settings: [
                {
                    title: 'Common',
                    groups: [
                        {
                            title: 'Hide Live Chat',
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr('hide-live-chat'),
                                    selectors: ['#chat-container'],
                                },
                            ],
                            storageKey: 'hideLiveChat',
                        },
                        {
                            title: 'Hide "Subscribe" button',

                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr('hide-subscribe-button'),
                                    selectors: ['#subscribe-button'],
                                },
                            ],
                            storageKey: 'subscribeButton',
                        },
                        {
                            title: 'Hide "Sponsor" button',

                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr('hide-sponsor-button'),
                                    selectors: ['#sponsor-button'],
                                },
                            ],
                            storageKey: 'hideSponsorButton',
                        },
                        {
                            title: 'Right comment mode',

                            actions: [
                                {
                                    urlRegExp: [UrlRegExps.Watch],
                                    attr: getAttr(),
                                    action: ElementActions.custom,
                                    selectors: [],
                                },
                            ],
                            storageKey: 'rightCommentMode',
                        },
                    ],
                },
                {
                    title: 'Persistent playback speed',
                    groups: [
                        {
                            actions: [
                                {
                                    attr: getAttr(),
                                    action: ElementActions.dropdown,
                                    selectors: [],
                                },
                            ],
                            onChange: (value: string) => {
                                if (value === 'disabled') {
                                    value = '1.00';
                                }
                                let movieContainer =
                                    document.querySelector('#movie_player');
                                if (movieContainer) {
                                    const player =
                                        movieContainer.getElementsByTagName(
                                            'video'
                                        )[0];
                                    player.playbackRate = Number(
                                        Number(value).toFixed(2)
                                    );
                                }
                                const newLocalStorageValue = {
                                    creation: Date.now(),
                                    data: value,
                                };
                                if (window.sessionStorage) {
                                    window.sessionStorage.setItem(
                                        'yt-player-playback-rate',
                                        JSON.stringify(newLocalStorageValue)
                                    );
                                }
                            },
                            options: [
                                {
                                    label: '0.5x',
                                    value: '0.50',
                                },
                                {
                                    label: '0.75x',
                                    value: '0.75',
                                },
                                {
                                    label: '1x',
                                    value: '1.00',
                                },
                                {
                                    label: '1.25x',
                                    value: '1.25',
                                },
                                {
                                    label: '1.5x',
                                    value: '1.50',
                                },
                                {
                                    label: '1.75x',
                                    value: '1.75',
                                },
                                {
                                    label: '2x',
                                    value: '2.25',
                                },
                                {
                                    label: '2.5x',
                                    value: '2.50',
                                },
                                {
                                    label: '2.75x',
                                    value: '2.75',
                                },
                                {
                                    label: '3x',
                                    value: '3.00',
                                },
                            ],
                            type: 'dropdown',
                            storageKey: 'persistentPlaybackSpeed',
                        },
                    ],
                },
                {
                    title: 'Persistent video quality',
                    groups: [
                        {
                            actions: [
                                {
                                    attr: getAttr(),
                                    action: ElementActions.dropdown,
                                    selectors: [],
                                },
                            ],
                            onChange: async (value: string) => {
                                // todo:
                                if (value === 'disabled') {
                                    value = '1080';
                                }
                                const newLocalStorageValue = {
                                    creation: Date.now(),
                                    data: JSON.stringify({
                                        quality: value,
                                        previousQuality: value,
                                    }),
                                    expiration:
                                        Date.now() + 24 * 60 * 60 * 1000,
                                };
                                if (window.localStorage) {
                                    window.localStorage.setItem(
                                        'yt-player-quality',
                                        JSON.stringify(newLocalStorageValue)
                                    );
                                }
                            },
                            options: [
                                {
                                    label: '2160p',
                                    value: '2160',
                                },
                                {
                                    label: '1440p',
                                    value: '1440',
                                },
                                {
                                    label: '1080p',
                                    value: '1080',
                                },
                                {
                                    label: '720p',
                                    value: '720',
                                },
                                {
                                    label: '480p',
                                    value: '480',
                                },
                                {
                                    label: '360p',
                                    value: '360',
                                },
                                {
                                    label: '240p',
                                    value: '240',
                                },
                                {
                                    label: '144p',
                                    value: '144',
                                },
                            ],
                            type: 'dropdown',
                            storageKey: 'persistentQuality',
                        },
                    ],
                },
                {
                    title: 'Persistent comment sort',
                    groups: [
                        {
                            actions: [
                                {
                                    urlRegExp: [UrlRegExps.Watch],
                                    attr: getAttr(),
                                    action: ElementActions.dropdown,
                                    selectors: [],
                                },
                            ],
                            onChange: async (value) => {
                                if (value === 'disabled') return;
                                const waitSelector =
                                    'ytd-comments#comments ytd-item-section-renderer:not([continuation-is-reloading])';
                                const selector = `#sort-menu tp-yt-paper-menu-button tp-yt-iron-dropdown a.yt-simple-endpoint.yt-dropdown-menu:nth-child(${
                                    value === 'popular' ? 1 : 2
                                })`;

                                await waitForElement(waitSelector);
                                const element = await waitForElement(selector);
                                if (element) {
                                    (element as HTMLElement).click();
                                }
                            },
                            options: [
                                {
                                    label: 'Popular',
                                    value: 'popular',
                                },
                                {
                                    label: 'Newest',
                                    value: 'newest',
                                },
                            ],
                            type: 'dropdown',
                            storageKey: 'persistentCommentSort',
                        },
                    ],
                },
                {
                    title: 'Player',
                    groups: [
                        {
                            title: 'Hide mini-size button',
                            actions: [
                                {
                                    attr: getAttr(
                                        'hide-player-minisize-button'
                                    ),
                                    action: ElementActions.hide,
                                    selectors: [
                                        'button.ytp-miniplayer-button.ytp-button',
                                    ],
                                },
                            ],
                            storageKey: 'hidePlayerMiniSizePlayerButton',
                        },
                        {
                            title: 'Hide wide-size button',
                            actions: [
                                {
                                    attr: getAttr(
                                        'hide-player-wide-size-button'
                                    ),
                                    action: ElementActions.hide,
                                    selectors: [
                                        'button.ytp-size-button.ytp-button',
                                    ],
                                },
                            ],
                            storageKey: 'hidePlayerWideSizePlayerButton',
                        },
                        {
                            title: 'Hide subtitles button',
                            actions: [
                                {
                                    attr: getAttr(
                                        'hide-player-subtitles-button'
                                    ),
                                    action: ElementActions.hide,
                                    selectors: [
                                        'button.ytp-subtitles-button.ytp-button',
                                    ],
                                },
                            ],
                            storageKey: 'hidePlayerSubtitlesButton',
                        },
                        {
                            title: 'Hide autoplay switcher',
                            actions: [
                                {
                                    attr: 'hide-player-autoplay',
                                    action: ElementActions.hide,
                                    selectors: [
                                        '[data-tooltip-target-id=ytp-autonav-toggle-button]',
                                    ],
                                },
                            ],
                            storageKey: 'hidePlayerAutoplay',
                        },
                    ],
                },
                {
                    title: 'Description',
                    groups: [
                        {
                            title: 'Auto-open description',
                            actions: [
                                {
                                    attr: '',
                                    action: ElementActions.click,
                                    selectors: ['#description #expand'],
                                },
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr('auto-open-description'),
                                    selectors: ['#description #collapse'],
                                },
                            ],
                            storageKey: 'autoOpenDescription',
                        },
                        {
                            title: 'Hide episodes description',
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr('hide-episodes-description'),
                                    selectors: [
                                        '#description ytd-horizontal-card-list-renderer:has(#dismissible)',
                                    ],
                                },
                            ],
                            storageKey: 'hideEpisodesDescription',
                        },
                        {
                            title: 'Hide transcript section',
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr('hide-transcript-section'),
                                    selectors: [
                                        '#description ytd-video-description-transcript-section-renderer',
                                    ],
                                },
                            ],
                            storageKey: 'hideTranscriptSection',
                        },
                        {
                            title: 'Hide people mentioned',
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr('hide-people-mentioned'),
                                    selectors: [
                                        '#description yt-video-attributes-section-view-model',
                                    ],
                                },
                            ],
                            storageKey: 'hidePeopleMentioned',
                        },
                        {
                            title: 'Hide related video',
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr(
                                        'hide-related-video-description'
                                    ),
                                    selectors: [
                                        '#description #infocards-section',
                                    ],
                                },
                            ],
                            storageKey: 'hideDescriptionRelatedVideo',
                        },
                    ],
                },
                {
                    title: 'Sponsored feed video',
                    groups: [
                        {
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr('sponsored-feed-video'),
                                    selectors: [
                                        'ytd-rich-item-renderer:has(ytd-ad-slot-renderer)',
                                    ],
                                },
                            ],
                            storageKey: 'adsFeedVideo',
                        },
                    ],
                    withoutCheckboxes: true,
                },
            ],
        },
        {
            title: 'Channel page',
            settings: [
                {
                    title: 'Channel banner',
                    groups: [
                        {
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr('channel-banner'),
                                    selectors: ['#page-header-banner'],
                                },
                            ],
                            storageKey: 'hideChannelBanner',
                        },
                    ],
                    withoutCheckboxes: true,
                },
                {
                    title: 'Channel trailer',
                    groups: [
                        {
                            actions: [
                                {
                                    urlRegExp: [UrlRegExps.Channel],
                                    action: ElementActions.hide,
                                    attr: getAttr('channel-trailer'),
                                    selectors: [
                                        'ytd-two-column-browse-results-renderer ytd-channel-video-player-renderer',
                                    ],
                                },
                                {
                                    urlRegExp: [UrlRegExps.Channel],
                                    action: ElementActions.custom,
                                    attr: getAttr('channel-trailer'),
                                    selectors: [],
                                    onEnable: async () => {
                                        try {
                                            await waitForElement(
                                                'ytd-two-column-browse-results-renderer ytd-channel-video-player-renderer .html5-video-player:not(.unstarted-mode) video[src]'
                                            );
                                            const results = [];
                                            const selectors: string[] = [
                                                'ytd-two-column-browse-results-renderer ytd-channel-video-player-renderer',
                                            ];
                                            const elements = await Promise.all(
                                                selectors.map(waitForElement)
                                            );

                                            for (const element of elements) {
                                                if (
                                                    element &&
                                                    element.parentNode
                                                ) {
                                                    const parent =
                                                        element.parentNode;
                                                    const nextSibling =
                                                        element.nextSibling;
                                                    element.remove();
                                                    results.push({
                                                        element,
                                                        parent,
                                                        nextSibling,
                                                    });
                                                }
                                            }
                                            return results;
                                        } catch (error) {
                                            //
                                        }
                                    },
                                    onDisable: async (
                                        cachedElements: any[]
                                    ) => {
                                        try {
                                            for (const cached of cachedElements) {
                                                if (
                                                    cached.parent &&
                                                    cached.element
                                                ) {
                                                    cached.parent.insertBefore(
                                                        cached.element,
                                                        cached.nextSibling
                                                    );
                                                }
                                            }
                                        } catch (e) {
                                            console.error(e);
                                        }
                                    },
                                },
                            ],
                            storageKey: 'hideChannelTrailer',
                        },
                    ],
                    withoutCheckboxes: true,
                },
            ],
        },
        {
            title: 'Ads',
            settings: [
                {
                    title: 'YouTube Banners',
                    groups: [
                        {
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr('youtube-banners'),
                                    selectors: ['ytd-banner-promo-renderer'],
                                },
                            ],
                            storageKey: 'adsYoutubeBanner',
                        },
                    ],
                    withoutCheckboxes: true,
                },
                {
                    title: 'Sponsored search results',
                    groups: [
                        {
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr('sponsored-search'),
                                    selectors: ['ytd-search-pyv-renderer'],
                                },
                            ],
                            storageKey: 'adsSearchResults',
                        },
                    ],
                    withoutCheckboxes: true,
                },
                {
                    title: 'Sponsored feed video',
                    groups: [
                        {
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr('sponsored-feed-video'),
                                    selectors: [
                                        'ytd-rich-item-renderer:has(ytd-ad-slot-renderer)',
                                    ],
                                },
                            ],
                            storageKey: 'adsFeedVideo',
                        },
                    ],
                    withoutCheckboxes: true,
                },
            ],
        },
        {
            title: 'Other',
            settings: [
                {
                    title: 'Hide Related videos',
                    groups: [
                        {
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr('hide-related-videos'),
                                    selectors: ['#related'],
                                },
                            ],
                            storageKey: 'relatedVideos',
                        },
                    ],
                },
                {
                    title: 'Right comment mode',
                    groups: [
                        {
                            actions: [
                                {
                                    urlRegExp: [UrlRegExps.Watch],
                                    attr: getAttr(),
                                    action: ElementActions.custom,
                                    selectors: [],
                                },
                            ],
                            storageKey: 'rightCommentMode',
                        },
                    ],
                },
                {
                    title: 'Hide related video',
                    groups: [
                        {
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr(
                                        'hide-related-video-description'
                                    ),
                                    selectors: [
                                        '#description #infocards-section',
                                    ],
                                },
                            ],
                            storageKey: 'hideDescriptionRelatedVideo',
                        },
                    ],
                },
            ],
        },
    ],
    storageActions: [],
};

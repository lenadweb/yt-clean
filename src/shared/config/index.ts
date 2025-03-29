import { UrlRegExps } from 'src/shared/const';
import { ElementActions, IConfig } from 'src/shared/types/config';
import { getAttr } from 'src/shared/utils/getAttr';

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
                },
                {
                    title: 'You',
                    groups: [
                        {
                            title: 'History',
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr(),
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
                                    attr: getAttr(),
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
                                    attr: getAttr(),
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
                                    attr: getAttr(),
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
                                    attr: getAttr(),
                                    selectors: [
                                        '#section-items ytd-guide-entry-renderer:has([href="/playlist?list=LL"])',
                                    ],
                                },
                            ],
                            storageKey: 'hideMenuLikedVideos',
                        },
                    ],
                },
            ],
        },
        {
            title: 'Sidebar & Navigation',
            settings: [
                {
                    title: 'Hide Create Video Button',
                    groups: [
                        {
                            title: 'asd',
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr(),
                                    selectors: [
                                        '#buttons .ytd-masthead:first-child',
                                    ],
                                },
                            ],
                            storageKey: 'hideCreateVideo',
                        },
                    ],
                },
                {
                    title: 'Hide Search Tags',
                    groups: [
                        {
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr(),
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
                    title: 'Hide Channel Banner',
                    groups: [
                        {
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr(),
                                    selectors: ['#wrapper #page-header-banner'],
                                },
                            ],
                            storageKey: 'hideChannelBanner',
                        },
                    ],
                },
                {
                    title: 'Hide Shorts',
                    groups: [
                        {
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr(),
                                    selectors: [
                                        '[is-shorts]',
                                        'ytd-reel-shelf-renderer.ytd-watch-next-secondary-results-renderer',
                                        'ytd-reel-shelf-renderer',
                                    ],
                                },
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr(),
                                    selectors: ['ytd-rich-section-renderer'],
                                },
                            ],
                            storageKey: 'hideShorts',
                        },
                    ],
                },
                {
                    title: 'Show voice search button',
                    groups: [
                        {
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr(),
                                    selectors: ['#voice-search-button'],
                                },
                            ],
                            storageKey: 'voiceButtonInSearch',
                        },
                    ],
                },
                {
                    title: 'Enable virtual keyboard',
                    groups: [
                        {
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr(),
                                    selectors: [
                                        '.ytSearchboxComponentYtdTextInputAssistantWrapper',
                                    ],
                                },
                            ],
                            storageKey: 'virtualKeyboard',
                        },
                    ],
                },
                {
                    title: 'Hide notifications button',
                    groups: [
                        {
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr(),
                                    selectors: [
                                        'ytd-notification-topbar-button-renderer.ytd-masthead',
                                    ],
                                },
                            ],
                            storageKey: 'notificationButton',
                        },
                    ],
                },
                {
                    title: 'Hide news section',
                    groups: [
                        {
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr(),
                                    selectors: [
                                        '#content > ytd-rich-shelf-renderer:has(#rich-shelf-header):not(:has(.shortsLockupViewModelHostThumbnail))',
                                    ],
                                },
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr(),
                                    selectors: ['ytd-rich-section-renderer'],
                                },
                            ],
                            storageKey: 'hideNewsSection',
                        },
                    ],
                },
                {
                    title: 'Hide Related videos',
                    groups: [
                        {
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr(),
                                    selectors: ['#related'],
                                },
                            ],
                            storageKey: 'relatedVideos',
                        },
                    ],
                },
                {
                    title: 'Hide Jams',
                    groups: [
                        {
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr(),
                                    selectors: [
                                        'ytd-rich-item-renderer:has(.yt-lockup-view-model-wiz--collection-stack-2)',
                                    ],
                                },
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr(),
                                    selectors: ['ytd-rich-section-renderer'],
                                },
                            ],
                            storageKey: 'hideJams',
                        },
                    ],
                },
                {
                    title: 'Hide live chat',
                    groups: [
                        {
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr(),
                                    selectors: ['#chat-container'],
                                },
                            ],
                            storageKey: 'hideLiveChat',
                        },
                    ],
                },
                {
                    title: 'Hide "Subscribe" button',
                    groups: [
                        {
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr(),
                                    selectors: ['#subscribe-button'],
                                },
                            ],
                            storageKey: 'subscribeButton',
                        },
                    ],
                },
                {
                    title: 'Hide "Sponsor" button',
                    groups: [
                        {
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr(),
                                    selectors: ['#sponsor-button'],
                                },
                            ],
                            storageKey: 'hideSponsorButton',
                        },
                    ],
                },
                {
                    title: 'Hide player autoplay',
                    groups: [
                        {
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
                    title: 'Hide player subtitles button',
                    groups: [
                        {
                            actions: [
                                {
                                    attr: getAttr(),
                                    action: ElementActions.hide,
                                    selectors: [
                                        'button.ytp-subtitles-button.ytp-button',
                                    ],
                                },
                            ],
                            storageKey: 'hidePlayerSubtitlesButton',
                        },
                    ],
                },
                {
                    title: 'Hide player wide size button',
                    groups: [
                        {
                            actions: [
                                {
                                    attr: getAttr(),
                                    action: ElementActions.hide,
                                    selectors: [
                                        'button.ytp-size-button.ytp-button',
                                    ],
                                },
                            ],
                            storageKey: 'hidePlayerWideSizePlayerButton',
                        },
                    ],
                },
                {
                    title: 'Hide player mini size button',
                    groups: [
                        {
                            actions: [
                                {
                                    attr: getAttr(),
                                    action: ElementActions.hide,
                                    selectors: [
                                        'button.ytp-miniplayer-button.ytp-button',
                                    ],
                                },
                            ],
                            storageKey: 'hidePlayerMiniSizePlayerButton',
                        },
                    ],
                },
                {
                    title: 'Hide Sponsor Video',
                    groups: [
                        {
                            actions: [
                                {
                                    attr: getAttr(),
                                    action: ElementActions.hide,
                                    selectors: [
                                        'ytd-rich-item-renderer:has(.badge-style-type-members-only)',
                                    ],
                                },
                            ],
                            storageKey: 'hideSponsorVideo',
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
                    title: 'Auto-open description',
                    groups: [
                        {
                            actions: [
                                {
                                    attr: '',
                                    action: ElementActions.click,
                                    selectors: ['#description #expand'],
                                },
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr(),
                                    selectors: ['#description #collapse'],
                                },
                            ],
                            storageKey: 'autoOpenDescription',
                        },
                    ],
                },
                {
                    title: 'Hide episodes description',
                    groups: [
                        {
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr(),
                                    selectors: [
                                        '#description ytd-horizontal-card-list-renderer:has(#dismissible)',
                                    ],
                                },
                            ],
                            storageKey: 'hideEpisodesDescription',
                        },
                    ],
                },
                {
                    title: 'Hide transcript section',
                    groups: [
                        {
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr(),
                                    selectors: [
                                        '#description ytd-video-description-transcript-section-renderer',
                                    ],
                                },
                            ],
                            storageKey: 'hideTranscriptSection',
                        },
                    ],
                },
                {
                    title: 'Hide people mentioned',
                    groups: [
                        {
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr(),
                                    selectors: [
                                        '#description yt-video-attributes-section-view-model',
                                    ],
                                },
                            ],
                            storageKey: 'hidePeopleMentioned',
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
                                    attr: getAttr(),
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

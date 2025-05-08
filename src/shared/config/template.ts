import {
    ElementActions,
    IAttrAction,
    ISettingsBlock,
} from 'src/shared/types/config';
import { getAttr } from 'src/shared/utils/getAttr';
import { UrlRegExps } from 'src/shared/const';
import { cookie } from 'src/shared/utils/cookies';

export const templateConfig: ISettingsBlock<IAttrAction[]> = {
    title: 'Basic template',
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
                            selectors: [
                                '.ytd-feed-filter-chip-bar-renderer',
                                '#frosted-glass',
                                '#header.ytd-rich-grid-renderer',
                                'yt-related-chip-cloud-renderer',
                            ],
                        },
                        {
                            action: ElementActions.customStyles,
                            attr: getAttr('hide-search-tags'),
                            selectors: [],
                            customStyles: [
                                `#chip-bar {
                                opacity: 0;
                                pointer-events: none;
                            }`,
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
                            selectors: ['#buttons .ytd-masthead:first-child'],
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
        {
            title: 'Search Mode',
            groups: [
                {
                    actions: [
                        {
                            urlRegExp: [
                                UrlRegExps.Watch,
                                UrlRegExps.Home,
                                UrlRegExps.Search,
                            ],
                            action: ElementActions.hide,
                            attr: getAttr('search-mode-hide-elements'),
                            selectors: [
                                'ytd-two-column-browse-results-renderer',
                                '.html5-endscreen',
                                'button.ytp-size-button.ytp-button',
                                '#related',
                            ],
                        },
                        {
                            urlRegExp: [UrlRegExps.Watch],
                            action: ElementActions.hide,
                            attr: getAttr('search-mode'),
                            selectors: ['#columns > #secondary'],
                        },
                        {
                            urlRegExp: [UrlRegExps.Watch],
                            action: ElementActions.custom,
                            attr: getAttr('search-mode'),
                            selectors: [],
                            onEnable: async () => {
                                cookie.remove('wide');
                                cookie.set('wide', '1');
                            },
                            onDisable: () => {
                                cookie.remove('wide');
                                cookie.set('wide', '0');
                            },
                        },
                        {
                            urlRegExp: [UrlRegExps.Watch, UrlRegExps.Home],
                            action: ElementActions.customStyles,
                            attr: getAttr('search-mode'),
                            selectors: [],
                            customStyles: [
                                `#primary {
                                            width: 100%!important;
                                            display: block!important;
                                            max-width: none!important;
                                            padding: 20px 0!important;
                                            margin: 0!important;
                                            box-sizing: border-box!important;
                                        }`,
                                `#columns {
                                            width: 100%!important;
                                            display: block!important;
                                            margin: 0 auto!important;
                                        }`,
                                `#page-manager:has(ytd-watch-flexy:not([fullscreen])) {
                                            width: 82.5vw!important;
                                            display: block!important;
                                            margin: 0 auto!important;
                                            padding-top: 68px!important;
                                        }`,
                                `ytd-watch-flexy:not([fullscreen]) #full-bleed-container {
                                            overflow: hidden!important;
                                            border-radius: 12px!important;
                                        }`,
                                `#columns {
                                            max-widht: none!important;
                                        }`,
                                `#primary {
                                            margin: 10px 0 0 0!important;
                                            padding: 0!important;
                                            width: 100%!important;
                                            max-width: none!important;
                                        }`,
                                `#description {
                                            margin: 12px 0!important;
                                            width: 100%!important;
                                        }`,
                                `ytd-watch-flexy:not([fullscreen]) #teaser-carousel {
                                            width: 100%!important;
                                            margin: 12px 0!important;
                                        }`,
                                `ytd-watch-flexy:not([fullscreen]) #ytd-player {
                                            overflow: hidden!important;
                                            border-radius: 12px!important;
                                        }`,
                                `ytd-watch-flexy[full-bleed-player]:not([fullscreen]) #full-bleed-container.ytd-watch-flexy {
                                            height: 46.40625vw!important;
                                        }`,
                                `#bottom-row.ytd-watch-metadata {
                                            flex-direction: column!important;
                                            margin: 0!important;
                                        }`,
                            ],
                        },
                    ],
                    storageKey: 'searchMode',
                },
            ],
            withoutCheckboxes: true,
        },
    ],
};

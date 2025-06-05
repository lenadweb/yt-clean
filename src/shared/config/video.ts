import {
    ElementActions,
    IAttrAction,
    ISettingsBlock,
} from 'src/shared/types/config';
import { getAttr } from 'src/shared/utils/getAttr';
import { UrlRegExps } from 'src/shared/const';
import { setPlaybackSpeed, setQualityVideo } from 'src/shared/utils/yt';
import { observeElementChanges, waitForElement } from 'src/shared/utils/dom';
import {
    clickElement,
    hideElement,
    showElement,
} from 'src/shared/utils/browser';

export const PLAYBACK_OPTIONS = [
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
];

export const videoConfig: ISettingsBlock<IAttrAction[]> = {
    title: 'Video Playback & Channel',
    settings: [
        // {
        //     title: 'Persistent playback speed',
        //     groups: [
        //         {
        //             options: PLAYBACK_OPTIONS,
        //             actions: [
        //                 {
        //                     action: ElementActions.hide,
        //                     attr: getAttr('playback-speed'),
        //                     selectors: [
        //                         // '.ytp-settings-menu .ytp-panel-menu > .ytp-menuitem:nth-child(6)',
        //                     ],
        //                 },
        //                 {
        //                     action: ElementActions.component,
        //                     urlRegExp: [UrlRegExps.Watch],
        //                     component: 'PlaybackSpeed',
        //                     selectors: [],
        //                     attr: getAttr('playback-speed'),
        //                     insertAfter:
        //                         '.ytp-right-controls .ytp-button.ytp-settings-button.ytp-hd-quality-badge',
        //                 },
        //             ],
        //             type: 'dropdown',
        //             storageKey: 'persistentPlaybackSpeed',
        //             onChange: async (value: string) => {
        //                 if (value === 'disabled') {
        //                     return;
        //                 }
        //                 const isTargetUrl = [
        //                     UrlRegExps.Watch,
        //                     UrlRegExps.Channel,
        //                 ].some((item) =>
        //                     new RegExp(item).test(window.location.href)
        //                 );
        //                 if (!isTargetUrl) return;
        //                 await waitForElement(
        //                     '.html5-video-player:not(.unstarted-mode) video[src]'
        //                 );
        //                 setPlaybackSpeed(value);
        //             },
        //         },
        //     ],
        // },
        // {
        //     title: 'Set 1x playback speed for music videos',
        //     groups: [
        //         {
        //             actions: [
        //                 {
        //                     urlRegExp: [UrlRegExps.Watch],
        //                     attr: getAttr(),
        //                     action: ElementActions.custom,
        //                     selectors: [],
        //                 },
        //             ],
        //             storageKey: 'defaultMusicPlaybackSpeed',
        //             onChange: async (value: string) => {
        //                 const isTargetUrl = new RegExp(UrlRegExps.Watch).test(
        //                     window.location.href
        //                 );
        //                 if (value !== 'disabled' && isTargetUrl) {
        //                     await waitForElement(
        //                         '.html5-video-player:not(.unstarted-mode) video[src]'
        //                     );
        //                     await waitForElement(
        //                         'yt-page-navigation-progress[hidden]'
        //                     );
        //                     await waitForElement(
        //                         '.html5-video-player:not(.unstarted-mode) video[src]'
        //                     );
        //                     hideElement('.ytp-popup.ytp-settings-menu');
        //                     clickElement('.ytp-settings-button');
        //                     clickElement('.ytp-settings-button');
        //                     showElement('.ytp-popup.ytp-settings-menu');
        //                     const isMusicVideo = await waitForElement(
        //                         ".ytp-drc-menu-item[aria-disabled='true']",
        //                         5000
        //                     );
        //                     console.log({ isMusicVideo });
        //                     if (isMusicVideo) {
        //                         setPlaybackSpeed('1.00');
        //                     }
        //                 }
        //             },
        //         },
        //     ],
        //     withoutCheckboxes: true,
        // },
        {
            title: 'Slider playback speed control',
            groups: [
                {
                    actions: [
                        {
                            action: ElementActions.component,
                            urlRegExp: [UrlRegExps.Watch],
                            component: 'PlaybackSpeed',
                            selectors: [],
                            attr: getAttr('playback-speed'),
                            insertAfter:
                                '.ytp-right-controls .ytp-button.ytp-settings-button.ytp-hd-quality-badge',
                        },
                    ],
                    storageKey: 'speedControl',
                    onChange: async (value: string) => {
                        if (value === 'disabled') {
                            return;
                        }
                        const isTargetUrl = [
                            UrlRegExps.Watch,
                            UrlRegExps.Channel,
                        ].some((item) =>
                            new RegExp(item).test(window.location.href)
                        );
                        if (!isTargetUrl) return;
                        await waitForElement(
                            '.html5-video-player:not(.unstarted-mode) video[src]'
                        );
                        setPlaybackSpeed(value);
                    },
                },
            ],
            withoutCheckboxes: true,
        },
        {
            title: 'Persistent video quality',
            groups: [
                {
                    actions: [],
                    onChange: async (value: string) => {
                        // todo:
                        if (value === 'disabled') {
                            value = '1080';
                        }
                        setQualityVideo(value);
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
        // {
        //     title: 'Persistent comment sort',
        //     groups: [
        //         {
        //             actions: [],
        //             onChange: async (value) => {
        //                 if (value === 'disabled') return;
        //                 const waitSelector =
        //                     'ytd-comments#comments ytd-item-section-renderer:not([continuation-is-reloading])';
        //                 const selector = `#sort-menu tp-yt-paper-menu-button tp-yt-iron-dropdown a.yt-simple-endpoint.yt-dropdown-menu:nth-child(${
        //                     value === 'popular' ? 1 : 2
        //                 })`;
        //
        //                 await waitForElement(waitSelector);
        //                 const element = await waitForElement(selector);
        //                 if (element) {
        //                     (element as HTMLElement).click();
        //                 }
        //             },
        //             options: [
        //                 {
        //                     label: 'Popular',
        //                     value: 'popular',
        //                 },
        //                 {
        //                     label: 'Newest',
        //                     value: 'newest',
        //                 },
        //             ],
        //             type: 'dropdown',
        //             storageKey: 'persistentCommentSort',
        //         },
        //     ],
        // },
        {
            title: 'Player',
            groups: [
                {
                    title: 'Hide mini-size button',
                    actions: [
                        {
                            attr: getAttr('hide-player-minisize-button'),
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
                            attr: getAttr('hide-player-wide-size-button'),
                            action: ElementActions.hide,
                            selectors: ['button.ytp-size-button.ytp-button'],
                        },
                    ],
                    storageKey: 'hidePlayerWideSizePlayerButton',
                },
                {
                    title: 'Hide subtitles button',
                    actions: [
                        {
                            attr: getAttr('hide-player-subtitles-button'),
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
            title: 'Shorts',
            groups: [
                {
                    title: 'Speed Control',
                    storageKey: 'shortSpeedControl',
                    actions: [
                        {
                            urlRegExp: [UrlRegExps.Shorts],
                            action: ElementActions.component,
                            component: 'ShortsSpeedControl',
                            insertAfter: '#cinematic-container',
                            selectors: [],
                            attr: getAttr(),
                        },
                    ],
                },
                {
                    title: 'Automatic switching to the next',
                    actions: [
                        {
                            urlRegExp: [UrlRegExps.Shorts],
                            action: ElementActions.custom,
                            attr: getAttr(),
                            selectors: [],
                            onEnable: async () => {
                                try {
                                    const id =
                                        '498d5cf9-dbda-4ded-b2a0-0218d1bc833d';
                                    const root = await waitForElement(
                                        '#shorts-player video',
                                        3000
                                    );
                                    if (!root) {
                                        return;
                                    }
                                    observeElementChanges(
                                        id,
                                        '#shorts-player video',
                                        (element) => {
                                            if (element?.hasAttribute('loop')) {
                                                element?.removeAttribute(
                                                    'loop'
                                                );
                                            }
                                        },
                                        {
                                            childList: false,
                                            subtree: false,
                                            attributes: true,
                                            attributeFilter: ['loop'],
                                            attributeOldValue: false,
                                            characterData: false,
                                            characterDataOldValue: false,
                                        },
                                        root as HTMLElement
                                    );
                                    await waitForElement(
                                        '#shorts-player.ended-mode'
                                    );
                                    const button = await waitForElement(
                                        '#navigation-button-down button'
                                    );
                                    if (button) {
                                        (button as HTMLButtonElement)?.click();
                                    }
                                } catch (error) {
                                    console.error(
                                        'Element not found or error occurred:',
                                        error
                                    );
                                }
                            },
                        },
                    ],
                    storageKey: 'autoNextShorts',
                },
            ],
        },
        {
            title: 'Description',
            groups: [
                // {
                //     title: 'Auto-open description',
                //     actions: [
                //         {
                //             attr: '',
                //             action: ElementActions.click,
                //             selectors: ['#description #expand'],
                //         },
                //         // {
                //         //     action: ElementActions.hide,
                //         //     attr: getAttr('auto-open-description'),
                //         //     selectors: ['#description #collapse'],
                //         // },
                //     ],
                //     storageKey: 'autoOpenDescription',
                // },
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
                            attr: getAttr('hide-related-video-description'),
                            selectors: ['#description #infocards-section'],
                        },
                    ],
                    storageKey: 'hideDescriptionRelatedVideo',
                },
            ],
        },
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
            ],
        },
        {
            title: 'Channel',
            groups: [
                {
                    title: 'Hide Channel trailer',
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
                                        selectors.map((selector, max) =>
                                            waitForElement(selector, max)
                                        )
                                    );

                                    for (const element of elements) {
                                        if (element && element.parentNode) {
                                            const parent = element.parentNode;
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
                            onDisable: async (cachedElements: any[]) => {
                                try {
                                    for (const cached of cachedElements) {
                                        if (cached.parent && cached.element) {
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
                {
                    title: 'Hide Channel banner',
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
        },
    ],
};

import { IFeatureConfig } from 'src/shared/types/config';
import { UrlRegExps } from 'src/shared/const';
import { setPlaybackSpeed } from 'src/shared/utils/yt';
import { observeElementChanges, waitForElement } from 'src/shared/utils/dom';
import {
    componentAction,
    createFeature,
    customAction,
    hideAction,
} from 'src/shared/config/helpers';

const video = 'Video Playback & Channel';

const playbackFeature = createFeature(video, 'Slider playback speed control', {
    withoutCheckboxes: true,
});
const playerFeature = createFeature(video, 'Player');
const shortsFeature = createFeature(video, 'Shorts');
const channelFeature = createFeature(video, 'Channel');

export const videoFeatures: IFeatureConfig[] = [
    playbackFeature({
        storageKey: 'speedControl',
        actions: [
            componentAction(
                'playback-speed',
                'PlaybackSpeed',
                '.ytp-right-controls .ytp-button.ytp-settings-button',
                {
                    urlRegExp: [UrlRegExps.Watch],
                }
            ),
        ],
        onChange: async (value: string) => {
            if (value === 'disabled') {
                return;
            }
            const isTargetUrl = [UrlRegExps.Watch, UrlRegExps.Channel].some(
                (item) => new RegExp(item).test(window.location.href)
            );
            if (!isTargetUrl) return;
            await waitForElement(
                '.html5-video-player:not(.unstarted-mode) video[src]'
            );
            setPlaybackSpeed(value);
        },
    }),
    playerFeature({
        title: 'Hide mini-size button',
        storageKey: 'hidePlayerMiniSizePlayerButton',
        actions: [
            hideAction('hide-player-minisize-button', [
                'button.ytp-miniplayer-button.ytp-button',
            ]),
        ],
    }),
    playerFeature({
        title: 'Hide wide-size button',
        storageKey: 'hidePlayerWideSizePlayerButton',
        actions: [
            hideAction('hide-player-wide-size-button', [
                'button.ytp-size-button.ytp-button',
            ]),
        ],
    }),
    playerFeature({
        title: 'Hide subtitles button',
        storageKey: 'hidePlayerSubtitlesButton',
        actions: [
            hideAction('hide-player-subtitles-button', [
                'button.ytp-subtitles-button.ytp-button',
            ]),
        ],
    }),
    playerFeature({
        title: 'Hide autoplay switcher',
        storageKey: 'hidePlayerAutoplay',
        actions: [
            hideAction('hide-player-autoplay', [
                '[data-tooltip-target-id=ytp-autonav-toggle-button]',
            ]),
        ],
    }),
    shortsFeature({
        title: 'Speed Control',
        storageKey: 'shortSpeedControl',
        actions: [
            componentAction(
                undefined,
                'ShortsSpeedControl',
                '#cinematic-container',
                {
                    urlRegExp: [UrlRegExps.Shorts],
                }
            ),
        ],
    }),
    shortsFeature({
        title: 'Automatic switching to the next',
        storageKey: 'autoNextShorts',
        actions: [
            customAction(undefined, {
                urlRegExp: [UrlRegExps.Shorts],
                onEnable: async () => {
                    try {
                        const id = '498d5cf9-dbda-4ded-b2a0-0218d1bc833d';
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
                                    element?.removeAttribute('loop');
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
                        await waitForElement('#shorts-player.ended-mode');
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
            }),
        ],
    }),
    channelFeature({
        title: 'Hide Channel trailer',
        storageKey: 'hideChannelTrailer',
        actions: [
            hideAction(
                'channel-trailer',
                [
                    'ytd-two-column-browse-results-renderer ytd-channel-video-player-renderer',
                ],
                {
                    urlRegExp: [UrlRegExps.Channel],
                }
            ),
            customAction('channel-trailer', {
                urlRegExp: [UrlRegExps.Channel],
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
                                const nextSibling = element.nextSibling;
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
            }),
        ],
    }),
    channelFeature({
        title: 'Hide Channel banner',
        storageKey: 'hideChannelBanner',
        actions: [hideAction('channel-banner', ['#page-header-banner'])],
    }),
];

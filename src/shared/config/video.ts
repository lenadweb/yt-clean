import { IFeatureDraft } from 'src/shared/types/config';
import { UrlRegExps } from 'src/shared/const';
import { setPlaybackSpeed } from 'src/shared/utils/yt';
import { observeElementChanges, waitForElement } from 'src/shared/utils/dom';
import {
    componentAction,
    createFeature,
    customAction,
    hideAction,
} from 'src/shared/config/helpers';

const video = 'video_playback_and_channel';

const playbackFeature = createFeature(video, 'slider_playback_speed_control', {
    withoutCheckboxes: true,
});
const playerFeature = createFeature(video, 'player');
const shortsFeature = createFeature(video, 'shorts');
const channelFeature = createFeature(video, 'channel');

export const videoFeatures: IFeatureDraft[] = [
    playbackFeature({
        id: 'speedControl',
        actions: [
            componentAction(
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
        titleKey: 'hide_mini_size_button',
        id: 'hidePlayerMiniSizePlayerButton',
        actions: [hideAction(['button.ytp-miniplayer-button.ytp-button'])],
    }),
    playerFeature({
        titleKey: 'hide_wide_size_button',
        id: 'hidePlayerWideSizePlayerButton',
        actions: [hideAction(['button.ytp-size-button.ytp-button'])],
    }),
    playerFeature({
        titleKey: 'hide_subtitles_button',
        id: 'hidePlayerSubtitlesButton',
        actions: [hideAction(['button.ytp-subtitles-button.ytp-button'])],
    }),
    playerFeature({
        titleKey: 'hide_autoplay_switcher',
        id: 'hidePlayerAutoplay',
        actions: [
            hideAction(['[data-tooltip-target-id=ytp-autonav-toggle-button]']),
        ],
    }),
    shortsFeature({
        titleKey: 'speed_control',
        id: 'shortSpeedControl',
        actions: [
            componentAction('ShortsSpeedControl', '#cinematic-container', {
                urlRegExp: [UrlRegExps.Shorts],
            }),
        ],
    }),
    shortsFeature({
        titleKey: 'automatic_switching_to_the_next',
        id: 'autoNextShorts',
        actions: [
            customAction({
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
        titleKey: 'hide_channel_trailer',
        id: 'hideChannelTrailer',
        actions: [
            hideAction(
                [
                    'ytd-two-column-browse-results-renderer ytd-channel-video-player-renderer',
                ],
                {
                    urlRegExp: [UrlRegExps.Channel],
                }
            ),
            customAction({
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
        titleKey: 'hide_channel_banner',
        id: 'hideChannelBanner',
        actions: [hideAction(['#page-header-banner'])],
    }),
];

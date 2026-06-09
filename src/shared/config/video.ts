import { IFeatureDraft } from 'src/shared/types/config';
import { UrlRegExps } from 'src/shared/const';
import {
    componentAction,
    createFeature,
    customAction,
    hideAction,
} from 'src/shared/config/helpers';
import {
    enableAutoNextShorts,
    hideChannelTrailer,
    restoreChannelTrailer,
    syncPlaybackSpeed,
} from 'src/shared/config/videoHandlers';

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
        onChange: syncPlaybackSpeed,
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
                onEnable: enableAutoNextShorts,
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
                onEnable: hideChannelTrailer,
                onDisable: restoreChannelTrailer,
            }),
        ],
    }),
    channelFeature({
        titleKey: 'hide_channel_banner',
        id: 'hideChannelBanner',
        actions: [hideAction(['#page-header-banner'])],
    }),
];

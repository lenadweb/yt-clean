import { UrlRegExps } from 'src/shared/const';
import { defineCategory } from 'src/shared/config/dsl';
import {
    enableAutoNextShorts,
    hideChannelTrailer,
    restoreChannelTrailer,
    syncPlaybackSpeed,
} from 'src/shared/config/videoHandlers';

const video = defineCategory('video_playback_and_channel');
const playback = video.section('slider_playback_speed_control', {
    withoutCheckboxes: true,
});
const player = video.section('player');
const shorts = video.section('shorts');
const channel = video.section('channel');

export const videoFeatures = [
    playback.feature({
        id: 'speedControl',
        url: [UrlRegExps.Watch],
        component: {
            name: 'PlaybackSpeed',
            after: '.ytp-right-controls .ytp-button.ytp-settings-button',
        },
        onChange: syncPlaybackSpeed,
    }),
    player.feature({
        id: 'hidePlayerMiniSizePlayerButton',
        title: 'hide_mini_size_button',
        hide: ['button.ytp-miniplayer-button.ytp-button'],
    }),
    player.feature({
        id: 'hidePlayerWideSizePlayerButton',
        title: 'hide_wide_size_button',
        hide: ['button.ytp-size-button.ytp-button'],
    }),
    player.feature({
        id: 'hidePlayerSubtitlesButton',
        title: 'hide_subtitles_button',
        hide: ['button.ytp-subtitles-button.ytp-button'],
    }),
    player.feature({
        id: 'hidePlayerAutoplay',
        title: 'hide_autoplay_switcher',
        hide: ['[data-tooltip-target-id=ytp-autonav-toggle-button]'],
    }),
    shorts.feature({
        id: 'shortSpeedControl',
        title: 'speed_control',
        url: [UrlRegExps.Shorts],
        component: {
            name: 'ShortsSpeedControl',
            after: '#cinematic-container',
        },
    }),
    shorts.feature({
        id: 'autoNextShorts',
        title: 'automatic_switching_to_the_next',
        url: [UrlRegExps.Shorts],
        custom: {
            enable: enableAutoNextShorts,
        },
    }),
    channel.feature({
        id: 'hideChannelTrailer',
        title: 'hide_channel_trailer',
        url: [UrlRegExps.Channel],
        hide: [
            'ytd-two-column-browse-results-renderer ytd-channel-video-player-renderer',
        ],
        custom: {
            enable: hideChannelTrailer,
            disable: restoreChannelTrailer,
        },
    }),
    channel.feature({
        id: 'hideChannelBanner',
        title: 'hide_channel_banner',
        hide: ['#page-header-banner'],
    }),
];

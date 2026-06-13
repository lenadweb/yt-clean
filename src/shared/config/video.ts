import { UrlRegExps } from 'src/shared/const';
import { category, feature, section } from 'src/shared/featureConfig/dsl';
import {
    disableAutoNextShorts,
    enableAutoNextShorts,
    hideChannelTrailer,
    restoreChannelTrailer,
    syncPlaybackSpeed,
} from 'src/shared/featureHandlers/video';

export const videoCategory = category('video_playback_and_channel', [
    section('slider_playback_speed_control', { controls: 'switch' }, [
        feature({
            id: 'speedControl',
            url: [UrlRegExps.Watch],
            component: {
                name: 'PlaybackSpeed',
                after: '.ytp-right-controls .ytp-button.ytp-settings-button',
            },
            onChange: syncPlaybackSpeed,
        }),
    ]),
    section('player', [
        feature({
            id: 'hidePlayerMiniSizePlayerButton',
            title: 'hide_mini_size_button',
            hide: ['button.ytp-miniplayer-button.ytp-button'],
        }),
        feature({
            id: 'hidePlayerWideSizePlayerButton',
            title: 'hide_wide_size_button',
            hide: ['button.ytp-size-button.ytp-button'],
        }),
        feature({
            id: 'hidePlayerSubtitlesButton',
            title: 'hide_subtitles_button',
            hide: ['button.ytp-subtitles-button.ytp-button'],
        }),
        feature({
            id: 'hidePlayerAutoplay',
            title: 'hide_autoplay_switcher',
            hide: ['[data-tooltip-target-id=ytp-autonav-toggle-button]'],
        }),
    ]),
    // section('shorts', [
    //     feature({
    //         id: 'shortSpeedControl',
    //         title: 'speed_control',
    //         url: [UrlRegExps.Shorts],
    //         component: {
    //             name: 'ShortsSpeedControl',
    //             after: '#shorts-inner-container',
    //         },
    //     }),
    //     feature({
    //         id: 'autoNextShorts',
    //         title: 'automatic_switching_to_the_next',
    //         url: [UrlRegExps.Shorts],
    //         custom: {
    //             enable: enableAutoNextShorts,
    //             disable: disableAutoNextShorts,
    //         },
    //     }),
    // ]),
    section('channel', [
        feature({
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
        feature({
            id: 'hideChannelBanner',
            title: 'hide_channel_banner',
            hide: ['#page-header-banner'],
        }),
    ]),
]);

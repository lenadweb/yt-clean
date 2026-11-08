import { UrlRegExps } from 'src/shared/const';
import {
    disconnectObserver,
    observeElementChanges,
} from 'src/shared/utils/dom';
import { parseSpeed, setPlaybackSpeed } from 'src/shared/utils/yt';
import { ENHANCED_BITRATE_EVENT } from 'src/shared/utils/quality';
import {
    disablePlayerBandwidthSpoofing,
    enablePlayerBandwidthSpoofing,
} from 'src/shared/utils/playerBandwidth';
import { LIVE_CHAT_VISIBILITY_EVENT } from 'src/shared/utils/liveChat';
import {
    CODEC_PREFERENCE_EVENT,
    CodecPreferenceId,
} from 'src/shared/utils/codec';
import { ORIGINAL_AUDIO_EVENT } from 'src/shared/utils/originalAudio';
import { dispatchEnabled } from 'src/shared/utils/events';
import { ORIGINAL_TITLES_EVENT } from 'src/shared/utils/originalTitles';

const CHANNEL_TRAILER_SELECTOR =
    'ytd-two-column-browse-results-renderer ytd-channel-video-player-renderer';
const CHANNEL_TRAILER_OBSERVER_ID = 'channel-trailer';

const MOVIE_PLAYER_SELECTOR = '#movie_player';
const AD_SHOWING_SELECTOR = '.html5-video-player.ad-showing';
const MOVIE_PLAYER_VIDEO_SELECTOR = `${MOVIE_PLAYER_SELECTOR} video`;
const PLAYBACK_SPEED_OBSERVER_ID = 'playback-speed-enforce';

let playbackSpeedController: AbortController | null = null;
let desiredSpeed: string | undefined;
let trackedVideo: HTMLVideoElement | null = null;

const isCurrentUrlMatched = (urlRegExps: RegExp[]): boolean =>
    urlRegExps.some((regexp) => regexp.test(window.location.href));

const isAdShowing = (): boolean =>
    Boolean(document.querySelector(AD_SHOWING_SELECTOR));

const enforcePlaybackSpeed = () => {
    if (!desiredSpeed || isAdShowing()) return;

    const video = document.querySelector(MOVIE_PLAYER_VIDEO_SELECTOR);
    if (!(video instanceof HTMLVideoElement)) return;

    const target = parseSpeed(desiredSpeed);
    if (Math.abs(video.playbackRate - target) > 0.001) {
        video.playbackRate = target;
    }

    if (video !== trackedVideo) {
        trackedVideo?.removeEventListener('ratechange', enforcePlaybackSpeed);
        video.addEventListener('ratechange', enforcePlaybackSpeed);
        trackedVideo = video;
    }
};

const stopPlaybackSpeedEnforcement = () => {
    playbackSpeedController?.abort();
    playbackSpeedController = null;
    disconnectObserver(PLAYBACK_SPEED_OBSERVER_ID);
    trackedVideo?.removeEventListener('ratechange', enforcePlaybackSpeed);
    trackedVideo = null;
    desiredSpeed = undefined;
};

export const syncPlaybackSpeed = async (
    value: string | undefined,
    enabled: boolean
) => {
    stopPlaybackSpeedEnforcement();
    if (!enabled || !value || !isCurrentUrlMatched([UrlRegExps.Watch])) {
        return;
    }

    const controller = new AbortController();
    playbackSpeedController = controller;
    desiredSpeed = value;

    const applied = await setPlaybackSpeed(value, controller.signal);
    if (!applied || controller.signal.aborted) return;

    observeElementChanges(
        PLAYBACK_SPEED_OBSERVER_ID,
        MOVIE_PLAYER_SELECTOR,
        enforcePlaybackSpeed,
        {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class'],
        },
        document.documentElement
    );
};

export const syncEnhancedBitrate = (
    _value: string | undefined,
    enabled: boolean
): void => {
    const isEnabled = enabled && isCurrentUrlMatched([UrlRegExps.Watch]);

    document.dispatchEvent(
        new CustomEvent(ENHANCED_BITRATE_EVENT, {
            detail: JSON.stringify({ enabled: isEnabled }),
        })
    );
};

export const syncPlayerBandwidthSpoofing = (
    _value: string | undefined,
    enabled: boolean
): void => {
    if (enabled) {
        enablePlayerBandwidthSpoofing();
        return;
    }

    disablePlayerBandwidthSpoofing();
};

export const syncLiveChatVisibility = (
    _value: string | undefined,
    enabled: boolean
): void => {
    const isEnabled = enabled && isCurrentUrlMatched([UrlRegExps.Watch]);

    document.dispatchEvent(
        new CustomEvent(LIVE_CHAT_VISIBILITY_EVENT, {
            detail: JSON.stringify({ enabled: isEnabled }),
        })
    );
};

export const syncOriginalAudio = (
    _value: string | undefined,
    enabled: boolean
): void =>
    dispatchEnabled(
        ORIGINAL_AUDIO_EVENT,
        enabled && isCurrentUrlMatched([UrlRegExps.Watch])
    );

export const syncOriginalTitles = (
    _value: string | undefined,
    enabled: boolean
): void => dispatchEnabled(ORIGINAL_TITLES_EVENT, enabled);

const dispatchCodecPreference = (
    id: CodecPreferenceId,
    enabled: boolean
): void => {
    document.dispatchEvent(
        new CustomEvent(CODEC_PREFERENCE_EVENT, {
            detail: JSON.stringify({ id, enabled }),
        })
    );
};

export const syncForceH264 = (
    _value: string | undefined,
    enabled: boolean
): void => dispatchCodecPreference('forceH264', enabled);

export const syncBlock60Fps = (
    _value: string | undefined,
    enabled: boolean
): void => dispatchCodecPreference('block60Fps', enabled);

const pauseChannelTrailer = (event: Event): void => {
    const video = event.target;
    if (
        video instanceof HTMLVideoElement &&
        video.closest(CHANNEL_TRAILER_SELECTOR) &&
        !video.paused
    ) {
        video.pause();
    }
};

export const hideChannelTrailer = (): void => {
    document.addEventListener('play', pauseChannelTrailer, true);
    observeElementChanges(
        CHANNEL_TRAILER_OBSERVER_ID,
        CHANNEL_TRAILER_SELECTOR,
        (trailer) => {
            trailer
                .querySelectorAll<HTMLVideoElement>('video')
                .forEach((video) => {
                    if (!video.paused) video.pause();
                });
        },
        { childList: true, subtree: true }
    );
};

export const restoreChannelTrailer = (): void => {
    disconnectObserver(CHANNEL_TRAILER_OBSERVER_ID);
    document.removeEventListener('play', pauseChannelTrailer, true);
};

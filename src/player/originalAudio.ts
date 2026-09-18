import { SETTINGS_CACHE_KEY } from 'src/shared/const';
import {
    AudioTrack,
    findOriginalTrack,
    isOriginalAudioCached,
    ORIGINAL_AUDIO_EVENT,
} from 'src/shared/utils/originalAudio';
import { parseEnabledDetail } from 'src/shared/utils/originalTitles';

interface AudioPlayerElement extends HTMLElement {
    getAvailableAudioTracks?: () => AudioTrack[] | undefined;
    getAudioTrack?: () => AudioTrack | null | undefined;
    setAudioTrack?: (track: AudioTrack) => void;
    getVideoData?: () => { video_id?: string } | undefined;
}

const MAX_ATTEMPTS = 20;
const RETRY_INTERVAL_MS = 500;

let enabled = false;
let appliedVideoId: string | null = null;
let retryTimer: number | null = null;

const readCachedSetting = (): boolean => {
    try {
        return isOriginalAudioCached(
            window.localStorage.getItem(SETTINGS_CACHE_KEY)
        );
    } catch {
        return false;
    }
};

const getPlayer = (): AudioPlayerElement | null =>
    document.getElementById('movie_player') as AudioPlayerElement | null;

const isAdShowing = (): boolean =>
    Boolean(document.querySelector('#movie_player.ad-showing'));

const clearRetryTimer = (): void => {
    if (retryTimer !== null) {
        window.clearInterval(retryTimer);
        retryTimer = null;
    }
};

const applyOriginalAudio = (): boolean => {
    const player = getPlayer();
    if (
        !player?.getAvailableAudioTracks ||
        !player.setAudioTrack ||
        isAdShowing()
    ) {
        return false;
    }

    try {
        const videoId = player.getVideoData?.()?.video_id;
        if (!videoId) return false;
        if (videoId === appliedVideoId) return true;

        const tracks = player.getAvailableAudioTracks() ?? [];
        if (tracks.length < 2) return false;

        appliedVideoId = videoId;

        const original = findOriginalTrack(tracks);
        if (original && player.getAudioTrack?.()?.id !== original.id) {
            player.setAudioTrack(original);
        }

        return true;
    } catch {
        return false;
    }
};

const scheduleApply = (): void => {
    clearRetryTimer();
    if (!enabled) return;

    let attempts = 0;
    const attempt = (): boolean => {
        attempts += 1;
        const isComplete = applyOriginalAudio() || attempts >= MAX_ATTEMPTS;
        if (isComplete) clearRetryTimer();
        return isComplete;
    };

    if (!attempt()) {
        retryTimer = window.setInterval(attempt, RETRY_INTERVAL_MS);
    }
};

export const initOriginalAudio = (): void => {
    enabled = readCachedSetting();

    document.addEventListener(ORIGINAL_AUDIO_EVENT, (event) => {
        const value = parseEnabledDetail(
            event instanceof CustomEvent ? event.detail : null
        );
        if (value === null) return;

        enabled = value;
        if (enabled) {
            scheduleApply();
        } else {
            clearRetryTimer();
        }
    });

    document.addEventListener(
        'loadedmetadata',
        (event) => {
            if (enabled && event.target instanceof HTMLVideoElement) {
                scheduleApply();
            }
        },
        true
    );

    window.addEventListener('yt-navigate-finish', scheduleApply);
    window.addEventListener('yt-player-updated', scheduleApply);
};

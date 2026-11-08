import { waitForElement } from 'src/shared/utils/dom';

const PLAYBACK_RATE_SESSION_KEY = 'yt-player-playback-rate';

export const parseSpeed = (value: string | undefined): number => {
    const speed = Number(Number(value).toFixed(2));
    return Number.isFinite(speed) && speed > 0 ? speed : 1;
};

export const setPlaybackSpeed = async (
    value: string,
    signal?: AbortSignal
): Promise<boolean> => {
    const player = await waitForElement(
        '#ytd-player:not(:has(.ytp-ad-player-overlay-layout__player-card-container)) #movie_player video',
        { signal }
    );
    if (signal?.aborted || !(player instanceof HTMLVideoElement)) return false;

    player.playbackRate = parseSpeed(value);
    window.sessionStorage?.setItem(
        PLAYBACK_RATE_SESSION_KEY,
        JSON.stringify({ creation: Date.now(), data: value })
    );
    return true;
};

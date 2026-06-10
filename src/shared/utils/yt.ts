import { waitForElement } from 'src/shared/utils/dom';

const PLAYBACK_RATE_SESSION_KEY = 'yt-player-playback-rate';

export const parseSpeed = (value: string | undefined): number => {
    const speed = Number(Number(value).toFixed(2));
    return Number.isFinite(speed) && speed > 0 ? speed : 1;
};

export const setPlaybackSpeed = (value: string) => {
    waitForElement(
        '#ytd-player:not(:has(.ytp-ad-player-overlay-layout__player-card-container)) #movie_player video'
    ).then((player) => {
        if (player instanceof HTMLVideoElement) {
            player.playbackRate = parseSpeed(value);
        }
        window.sessionStorage?.setItem(
            PLAYBACK_RATE_SESSION_KEY,
            JSON.stringify({ creation: Date.now(), data: value })
        );
    });
};

export const setShortsPlaybackSpeed = (value: string) => {
    const player = document.querySelector('#shorts-player video');
    if (player instanceof HTMLVideoElement) {
        player.playbackRate = parseSpeed(value);
    }
};

import { waitForElement } from 'src/shared/utils/dom';

export const setPlaybackSpeed = (value: string) => {
    waitForElement(
        '#ytd-player:not(:has(.ytp-ad-player-overlay-layout__player-card-container)) #movie_player video'
    ).then((player) => {
        if (player) {
            (player as HTMLVideoElement).playbackRate = Number(
                Number(value).toFixed(2)
            );
        }
        const newLocalStorageValue = {
            creation: Date.now(),
            data: value,
        };
        if (window.sessionStorage) {
            window.sessionStorage.setItem(
                'yt-player-playback-rate',
                JSON.stringify(newLocalStorageValue)
            );
        }
    });
};

export const setShortsPlaybackSpeed = (value: string) => {
    const movieContainer = document.querySelector('#shorts-player');
    if (movieContainer) {
        const player = movieContainer.getElementsByTagName('video')[0];
        player.playbackRate = Number(Number(value).toFixed(2));
    }
};

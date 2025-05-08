import { waitForElement } from 'src/shared/utils/dom';

export const setPlaybackSpeed = (value: string) => {
    waitForElement('#movie_player video').then((player) => {
        if (player) {
            (player as any).playbackRate = Number(Number(value).toFixed(2));
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

export const setQualityVideo = (value: string) => {
    const newLocalStorageValue = {
        creation: Date.now(),
        data: JSON.stringify({
            quality: value,
            previousQuality: value,
        }),
        expiration: Date.now() + 24 * 60 * 60 * 1000,
    };
    if (window.localStorage) {
        window.localStorage.setItem(
            'yt-player-quality',
            JSON.stringify(newLocalStorageValue)
        );
    }
};

export const setShortsPlaybackSpeed = (value: string) => {
    let movieContainer = document.querySelector('#shorts-player');
    if (movieContainer) {
        const player = movieContainer.getElementsByTagName('video')[0];
        player.playbackRate = Number(Number(value).toFixed(2));
    }
};

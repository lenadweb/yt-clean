import {
    disconnectObserver,
    observeElementChanges,
} from 'src/shared/utils/dom';

const OBSERVER_ID = 'auto-mute-ads';
const STATUS_ATTRIBUTE = 'data-yt-clean-ad-mute';
let enabled = false;
let pollTimer: ReturnType<typeof setInterval> | null = null;
let mutedAd: { video: HTMLVideoElement; wasMuted: boolean } | null = null;

const getVideo = (player = document.getElementById('movie_player')) =>
    player?.querySelector<HTMLVideoElement>('video.html5-main-video') ??
    player?.querySelector<HTMLVideoElement>('video') ??
    null;

const setStatus = (status: string) => {
    if (document.documentElement.getAttribute(STATUS_ATTRIBUTE) !== status)
        document.documentElement.setAttribute(STATUS_ATTRIBUTE, status);
};

const restoreMute = (replacement?: HTMLVideoElement | null) => {
    if (!mutedAd) return;
    const { video, wasMuted } = mutedAd;
    mutedAd = null;
    // Leave volume unchanged and preserve an explicit unmute at the boundary.
    if (video.muted) video.muted = wasMuted;
    // YouTube can replace its video while keeping the ad's forced mute state.
    if (replacement && replacement !== video && replacement.muted)
        replacement.muted = wasMuted;
};

const checkForAd = () => {
    if (!enabled) return;
    const player = document.getElementById('movie_player');
    const video = getVideo(player);
    if (!player || !video || !player.matches('.ad-showing, .ad-interrupting')) {
        restoreMute(video);
        setStatus('waiting');
        return;
    }
    if (mutedAd?.video !== video) {
        const wasMuted = mutedAd?.wasMuted ?? video.muted;
        restoreMute();
        mutedAd = { video, wasMuted };
    }
    if (!video.muted) video.muted = true;
    setStatus('muted');
};

const onPageHide = () => restoreMute(getVideo());
const onPageShow = () => checkForAd();

export const disableAutoMuteAds = () => {
    enabled = false;
    disconnectObserver(OBSERVER_ID);
    if (pollTimer !== null) clearInterval(pollTimer);
    pollTimer = null;
    window.removeEventListener('pagehide', onPageHide);
    window.removeEventListener('pageshow', onPageShow);
    restoreMute(getVideo());
    setStatus('disabled');
};

export const enableAutoMuteAds = () => {
    if (enabled) {
        checkForAd();
        return;
    }
    enabled = true;
    setStatus('waiting');
    pollTimer = setInterval(checkForAd, 250);
    window.addEventListener('pagehide', onPageHide);
    window.addEventListener('pageshow', onPageShow);
    observeElementChanges(
        OBSERVER_ID,
        '#movie_player',
        checkForAd,
        {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'src'],
        },
        document.documentElement
    );
};

import {
    disconnectObserver,
    observeElementChanges,
    waitForElement,
} from 'src/shared/utils/dom';

const AUTO_SKIP_ADS_OBSERVER_ID = 'auto-skip-ads';
const ENFORCEMENT_OBSERVER_ID = 'auto-skip-ads-enforcement';
const PLAYER_SELECTOR = '#movie_player';
const AD_PLAYER_SELECTOR = '.html5-video-player.ad-showing';
const SKIP_BUTTON_SELECTOR =
    '.ytp-ad-skip-button-modern, .ytp-ad-skip-button, .ytp-skip-ad-button, .ytp-ad-skip-button-text';
const ENFORCEMENT_SELECTOR = 'ytd-enforcement-message-view-model';
const BACKDROP_SELECTOR = 'tp-yt-iron-overlay-backdrop';

const skipAd = (player: Element) => {
    const skipButton = player.querySelector<HTMLElement>(SKIP_BUTTON_SELECTOR);
    if (skipButton) {
        skipButton.click();
        return;
    }

    const video = player.querySelector<HTMLVideoElement>('video');
    if (video && Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = video.duration;
    }
};

const resumePlayback = () => {
    const video = document.querySelector<HTMLVideoElement>(
        `${PLAYER_SELECTOR} video`
    );
    if (video?.paused) {
        void video.play().catch(() => {});
    }
};

const dismissEnforcement = (enforcement: Element) => {
    const dialog = enforcement.closest('tp-yt-paper-dialog');
    (dialog ?? enforcement).remove();

    document
        .querySelectorAll(BACKDROP_SELECTOR)
        .forEach((backdrop) => backdrop.remove());

    document.documentElement.style.removeProperty('overflow');
    document.body?.style.removeProperty('overflow');

    resumePlayback();
};

export const enableAutoSkipAds = async () => {
    const player = await waitForElement(PLAYER_SELECTOR, { timeout: 10000 });

    observeElementChanges(
        AUTO_SKIP_ADS_OBSERVER_ID,
        AD_PLAYER_SELECTOR,
        skipAd,
        {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class'],
        },
        player ?? document.documentElement
    );

    observeElementChanges(
        ENFORCEMENT_OBSERVER_ID,
        ENFORCEMENT_SELECTOR,
        dismissEnforcement,
        { childList: true, subtree: true },
        document.documentElement
    );
};

export const disableAutoSkipAds = () => {
    disconnectObserver(AUTO_SKIP_ADS_OBSERVER_ID);
    disconnectObserver(ENFORCEMENT_OBSERVER_ID);
};

import {
    disconnectObserver,
    observeElementChanges,
    waitForElement,
} from 'src/shared/utils/dom';

const AUTO_SKIP_ADS_OBSERVER_ID = 'auto-skip-ads';
const PLAYER_SELECTOR = '#movie_player';
const AD_PLAYER_SELECTOR = '.html5-video-player.ad-showing';
const SKIP_BUTTON_SELECTOR =
    '.ytp-ad-skip-button-modern, .ytp-ad-skip-button, .ytp-skip-ad-button, .ytp-ad-skip-button-text';

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
};

export const disableAutoSkipAds = () => {
    disconnectObserver(AUTO_SKIP_ADS_OBSERVER_ID);
};

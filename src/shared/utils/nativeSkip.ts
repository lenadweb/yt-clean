export const NATIVE_SKIP_MESSAGE = 'yt-clean-native-skip';
export const NATIVE_SKIP_RESET_MESSAGE = 'yt-clean-native-skip-reset';
export type NativeSkipStatus =
    | 'ready'
    | 'clicked'
    | 'unavailable'
    | 'disabled'
    | 'busy'
    | 'canceled'
    | 'error';
export interface NativeSkipResult {
    status: NativeSkipStatus;
    detail?: string;
    version?: string;
}

// Self-contained because the worker also runs this function's serialized body
// in the page immediately before sending browser mouse input.
export const findNativeSkipButton = (): HTMLElement | null => {
    const player = document.getElementById('movie_player');
    if (!player) return null;
    // Current YouTube versions can render the ad module beside movie_player.
    const host = player.closest('ytd-player') ?? player;
    const selectors = [
        'button.ytp-ad-skip-button-modern',
        'button.ytp-ad-skip-button',
        'button.ytp-skip-ad-button',
        'button.ytp-skip-ad-button-modern',
        'button[id^="skip-button:"]',
    ].join(',');
    for (const button of host.querySelectorAll<HTMLElement>(selectors)) {
        if (
            !player.matches('.ad-showing, .ad-interrupting') &&
            !button.closest(
                '[id^="player-overlay-layout:"], .ytp-ad-player-overlay-layout, .ytp-player-overlay-layout, .ytp-video-interstitial-buttoned-centered-layout'
            )
        )
            continue;
        if (
            button.matches(':disabled, [aria-disabled="true"]') ||
            button.closest('[hidden], [inert], [aria-hidden="true"]') ||
            !button.getClientRects().length
        )
            continue;
        // These inherited properties can be overridden by the button. YouTube
        // uses pointer-events:none on its overlay and auto on the Skip button.
        const buttonStyle = window.getComputedStyle(button);
        if (
            buttonStyle.visibility !== 'visible' ||
            buttonStyle.pointerEvents === 'none'
        )
            continue;
        let visible = true;
        for (
            let element: HTMLElement | null = button;
            element;
            element = element.parentElement
        ) {
            const style = window.getComputedStyle(element);
            if (style.display === 'none' || style.opacity === '0') {
                visible = false;
                break;
            }
        }
        if (!visible) continue;
        const rect = button.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        if (
            rect.width <= 0 ||
            rect.height <= 0 ||
            x < 0 ||
            y < 0 ||
            x >= window.innerWidth ||
            y >= window.innerHeight
        )
            continue;
        const hit = document.elementFromPoint(x, y);
        if (!hit || (hit !== button && !button.contains(hit))) continue;
        return button;
    }
    return null;
};

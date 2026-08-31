import {
    ENHANCED_BITRATE_EVENT,
    selectEnhancedBitrateFormat,
} from 'src/shared/utils/quality';
import { LIVE_CHAT_VISIBILITY_EVENT } from 'src/shared/utils/liveChat';

interface YouTubePlayerElement extends HTMLElement {
    getAvailableQualityData?: () => unknown;
    getVideoStats?: () => { fmt?: string | number };
    setPlaybackQualityRange?: (
        minimum: string,
        maximum: string,
        formatId?: string | number
    ) => void;
}

interface EnhancedBitratePayload {
    enabled: boolean;
}

interface YouTubeLiveChatFrame extends HTMLElement {
    collapsed?: boolean;
    setCollapsedState?: (action: {
        setLiveChatCollapsedStateAction: { collapsed: boolean };
    }) => void;
}

const MAX_ATTEMPTS = 20;
const RETRY_INTERVAL_MS = 400;

let enabled = false;
let activeTimer: number | null = null;
let appliedFormatId: string | number | null = null;
let liveChatHidden = false;
let liveChatTimer: number | null = null;

const getPlayer = (): YouTubePlayerElement | null =>
    document.getElementById('movie_player') as YouTubePlayerElement | null;

const clearRetryTimer = (): void => {
    if (activeTimer !== null) {
        window.clearInterval(activeTimer);
        activeTimer = null;
    }
};

const clearLiveChatTimer = (): void => {
    if (liveChatTimer !== null) {
        window.clearInterval(liveChatTimer);
        liveChatTimer = null;
    }
};

const isAdShowing = (): boolean =>
    Boolean(document.querySelector('#movie_player.ad-showing'));

const applyEnhancedBitrate = (): boolean => {
    const player = getPlayer();
    if (
        !player?.getAvailableQualityData ||
        !player.setPlaybackQualityRange ||
        isAdShowing()
    ) {
        return false;
    }

    try {
        const target = selectEnhancedBitrateFormat(
            player.getAvailableQualityData()
        );
        if (!target) return false;

        const currentFormatId = player.getVideoStats?.().fmt;
        if (
            currentFormatId !== undefined &&
            String(currentFormatId) === String(target.formatId)
        ) {
            appliedFormatId = target.formatId;
            return true;
        }

        player.setPlaybackQualityRange(
            target.quality,
            target.quality,
            target.formatId
        );
        appliedFormatId = target.formatId;

        return !player.getVideoStats;
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
        const isComplete = applyEnhancedBitrate() || attempts >= MAX_ATTEMPTS;
        if (isComplete) {
            clearRetryTimer();
        }
        return isComplete;
    };

    if (!attempt()) {
        activeTimer = window.setInterval(attempt, RETRY_INTERVAL_MS);
    }
};

const releaseQualityRange = (): void => {
    clearRetryTimer();
    if (appliedFormatId === null) return;

    try {
        getPlayer()?.setPlaybackQualityRange?.('auto', 'auto');
    } catch {
        // The private player API can disappear while YouTube replaces the player.
    }
    appliedFormatId = null;
};

const parsePayload = (event: Event): EnhancedBitratePayload | null => {
    if (!(event instanceof CustomEvent) || typeof event.detail !== 'string') {
        return null;
    }

    try {
        const payload = JSON.parse(
            event.detail
        ) as Partial<EnhancedBitratePayload>;
        return typeof payload.enabled === 'boolean'
            ? { enabled: payload.enabled }
            : null;
    } catch {
        return null;
    }
};

const getLiveChatFrame = (): YouTubeLiveChatFrame | null =>
    document.querySelector(
        'ytd-live-chat-frame#chat'
    ) as YouTubeLiveChatFrame | null;

const isLiveChatCollapsed = (chat: YouTubeLiveChatFrame): boolean =>
    chat.collapsed === true || chat.hasAttribute('collapsed');

const updatePlayerLayout = (): void => {
    window.dispatchEvent(new Event('resize'));
    window.setTimeout(() => window.dispatchEvent(new Event('resize')), 120);
};

const collapseLiveChat = (): boolean => {
    const chat = getLiveChatFrame();
    if (!chat) return false;

    if (isLiveChatCollapsed(chat)) {
        updatePlayerLayout();
        return true;
    }

    try {
        chat.setCollapsedState?.({
            setLiveChatCollapsedStateAction: { collapsed: true },
        });
    } catch {
        // Fall through to YouTube's own toggle button if its private API changed.
    }

    if (!isLiveChatCollapsed(chat)) {
        const toggle = chat.querySelector<HTMLElement>(
            '#show-hide-button button, #show-hide-button ytd-toggle-button-renderer, #show-hide-button'
        );
        toggle?.click();
    }

    const collapsed = isLiveChatCollapsed(chat);
    if (collapsed) updatePlayerLayout();
    return collapsed;
};

const scheduleLiveChatCollapse = (): void => {
    clearLiveChatTimer();
    if (!liveChatHidden) return;

    let attempts = 0;
    const attempt = (): boolean => {
        attempts += 1;
        const isComplete = collapseLiveChat() || attempts >= MAX_ATTEMPTS;
        if (isComplete) clearLiveChatTimer();
        return isComplete;
    };

    if (!attempt()) {
        liveChatTimer = window.setInterval(attempt, RETRY_INTERVAL_MS);
    }
};

document.addEventListener(ENHANCED_BITRATE_EVENT, (event) => {
    const payload = parsePayload(event);
    if (!payload) return;

    enabled = payload.enabled;
    if (enabled) {
        scheduleApply();
    } else {
        releaseQualityRange();
    }
});

document.addEventListener(LIVE_CHAT_VISIBILITY_EVENT, (event) => {
    const payload = parsePayload(event);
    if (!payload) return;

    liveChatHidden = payload.enabled;
    if (liveChatHidden) {
        scheduleLiveChatCollapse();
    } else {
        clearLiveChatTimer();
        updatePlayerLayout();
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

window.addEventListener('yt-navigate-finish', () => {
    scheduleApply();
    scheduleLiveChatCollapse();
});
window.addEventListener('yt-player-updated', scheduleApply);
document.addEventListener('fullscreenchange', scheduleApply);

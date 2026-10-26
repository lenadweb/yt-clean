import {
    disconnectObserver,
    observeElementChanges,
} from 'src/shared/utils/dom';
import {
    findNativeSkipButton,
    NATIVE_SKIP_MESSAGE,
    NATIVE_SKIP_RESET_MESSAGE,
    NativeSkipResult,
} from 'src/shared/utils/nativeSkip';
import { version as buildVersion } from 'src/manifest.json';

const OBSERVER_ID = 'auto-skip-ads';
const STATUS_ATTRIBUTE = 'data-yt-clean-native-skip';
const DETAIL_ATTRIBUTE = 'data-yt-clean-native-skip-detail';
let enabled = false;
let pending = false;
let generation = 0;
let retryTimer: ReturnType<typeof setTimeout> | null = null;
let pollTimer: ReturnType<typeof setInterval> | null = null;
let canceled = false;
let connected = false;

const reportRuntimeError = (error: unknown) => {
    const message = String(error);
    const invalidated = /Extension context invalidated/i.test(message);
    const detail = invalidated
        ? 'extension-context-invalidated'
        : /receiving end does not exist|could not establish connection/i.test(
                message
            )
          ? 'worker-unreachable'
          : /sendMessage.*not a function|Cannot read properties of undefined/i.test(
                  message
              )
            ? 'runtime-api-unavailable'
            : 'runtime-message-failed';
    disableAutoSkipAds();
    document.documentElement.setAttribute(
        STATUS_ATTRIBUTE,
        invalidated ? 'reload-required' : 'error'
    );
    document.documentElement.setAttribute(DETAIL_ATTRIBUTE, detail);
    console.warn('[YouTube Clean Native Skip]', detail, error);
};

const checkForSkip = () => {
    if (
        !enabled ||
        !connected ||
        pending ||
        retryTimer !== null ||
        canceled ||
        !findNativeSkipButton()
    )
        return;
    pending = true;
    const currentGeneration = generation;
    document.documentElement.setAttribute(STATUS_ATTRIBUTE, 'requesting');
    void Promise.resolve()
        .then(() => chrome.runtime.sendMessage({ type: NATIVE_SKIP_MESSAGE }))
        .then((result: NativeSkipResult) => {
            if (!enabled || generation !== currentGeneration) return;
            if (!result?.status) throw new Error('No worker response');
            document.documentElement.setAttribute(
                STATUS_ATTRIBUTE,
                result.status === 'clicked'
                    ? 'browser-click-sent'
                    : result.status
            );
            canceled = result.status === 'canceled';
            document.documentElement.setAttribute(
                DETAIL_ATTRIBUTE,
                result.detail ?? result.status
            );
        })
        .catch((error) => {
            if (!enabled || generation !== currentGeneration) return;
            reportRuntimeError(error);
        })
        .finally(() => {
            if (!enabled || generation !== currentGeneration) return;
            pending = false;
            // Also retry after a busy debugger or a CSS transition without
            // relying on another DOM mutation.
            retryTimer = setTimeout(() => {
                retryTimer = null;
                checkForSkip();
            }, 1500);
        });
};

export const disableAutoSkipAds = () => {
    enabled = false;
    generation += 1;
    pending = false;
    connected = false;
    disconnectObserver(OBSERVER_ID);
    if (retryTimer !== null) clearTimeout(retryTimer);
    if (pollTimer !== null) clearInterval(pollTimer);
    retryTimer = null;
    pollTimer = null;
    document.documentElement.setAttribute(STATUS_ATTRIBUTE, 'disabled');
};

export const enableAutoSkipAds = () => {
    if (canceled) {
        document.documentElement.setAttribute(STATUS_ATTRIBUTE, 'canceled');
        document.documentElement.setAttribute(
            DETAIL_ATTRIBUTE,
            'reload-to-resume'
        );
        return;
    }
    if (enabled) {
        checkForSkip();
        return;
    }
    disableAutoSkipAds();
    enabled = true;
    const currentGeneration = generation;
    document.documentElement.setAttribute(STATUS_ATTRIBUTE, 'connecting');
    document.documentElement.setAttribute(
        DETAIL_ATTRIBUTE,
        'contacting-worker'
    );
    document.documentElement.setAttribute(
        'data-yt-clean-version',
        buildVersion
    );
    document.documentElement.removeAttribute(
        'data-yt-clean-native-skip-worker-version'
    );
    void Promise.resolve()
        .then(() =>
            chrome.runtime.sendMessage({ type: NATIVE_SKIP_RESET_MESSAGE })
        )
        .then((result: NativeSkipResult) => {
            if (!enabled || generation !== currentGeneration) return;
            if (result?.version) {
                document.documentElement.setAttribute(
                    'data-yt-clean-native-skip-worker-version',
                    result.version
                );
            }
            if (result?.status === 'canceled') {
                canceled = true;
                document.documentElement.setAttribute(
                    STATUS_ATTRIBUTE,
                    'canceled'
                );
                document.documentElement.setAttribute(
                    DETAIL_ATTRIBUTE,
                    'reload-to-resume'
                );
                return;
            }
            if (result?.status !== 'ready' || result.version !== buildVersion) {
                disableAutoSkipAds();
                document.documentElement.setAttribute(
                    STATUS_ATTRIBUTE,
                    'error'
                );
                document.documentElement.setAttribute(
                    DETAIL_ATTRIBUTE,
                    result?.detail ?? 'worker-version-mismatch'
                );
                return;
            }
            connected = true;
            document.documentElement.setAttribute(STATUS_ATTRIBUTE, 'waiting');
            document.documentElement.setAttribute(
                DETAIL_ATTRIBUTE,
                'worker-connected'
            );
            checkForSkip();
        })
        .catch((error) => {
            if (!enabled || generation !== currentGeneration) return;
            reportRuntimeError(error);
        });
    // CSS animations can reveal Skip without changing DOM attributes.
    pollTimer = setInterval(checkForSkip, 500);
    observeElementChanges(
        OBSERVER_ID,
        '#movie_player',
        checkForSkip,
        {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: [
                'class',
                'style',
                'hidden',
                'inert',
                'disabled',
                'aria-hidden',
                'aria-disabled',
            ],
        },
        document.documentElement
    );
};

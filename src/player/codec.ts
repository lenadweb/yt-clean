import { SETTINGS_CACHE_KEY } from 'src/shared/const';
import {
    CODEC_PREFERENCE_EVENT,
    CodecPreference,
    DEFAULT_CODEC_PREFERENCE,
    isCodecPreferenceActive,
    isCodecTypeBlocked,
    isFramerateBlocked,
    parseCodecPreference,
    parseCodecPreferenceChange,
} from 'src/shared/utils/codec';

type TypeChecker = (this: unknown, type: string) => unknown;

type DecodingInfo = (
    configuration: MediaDecodingConfiguration
) => Promise<MediaCapabilitiesDecodingInfo>;

let preference: CodecPreference = DEFAULT_CODEC_PREFERENCE;
let patched = false;

const readCachedPreference = (): CodecPreference => {
    try {
        return parseCodecPreference(
            window.localStorage.getItem(SETTINGS_CACHE_KEY)
        );
    } catch {
        return DEFAULT_CODEC_PREFERENCE;
    }
};

const patchTypeChecker = (
    target: object,
    key: string,
    blockedResult: '' | false
): void => {
    const original = (target as Record<string, unknown>)[key];
    if (typeof original !== 'function') return;

    const checker = original as TypeChecker;

    Object.defineProperty(target, key, {
        configurable: true,
        writable: true,
        value: function checkType(this: unknown, type: string) {
            return isCodecTypeBlocked(type, preference)
                ? blockedResult
                : checker.call(this, type);
        },
    });
};

const patchDecodingInfo = (): void => {
    const capabilities = navigator.mediaCapabilities;
    if (typeof capabilities?.decodingInfo !== 'function') return;

    const original = capabilities.decodingInfo.bind(
        capabilities
    ) as DecodingInfo;

    capabilities.decodingInfo = (configuration) => {
        const video = configuration?.video;
        const blocked =
            Boolean(video) &&
            (isCodecTypeBlocked(video?.contentType, preference) ||
                isFramerateBlocked(video?.framerate, preference));

        return blocked
            ? Promise.resolve({
                  supported: false,
                  smooth: false,
                  powerEfficient: false,
                  configuration,
                  keySystemAccess: null,
              } as MediaCapabilitiesDecodingInfo)
            : original(configuration);
    };
};

const patchCodecSupport = (): void => {
    if (patched) return;
    patched = true;

    patchTypeChecker(HTMLVideoElement.prototype, 'canPlayType', '');
    if (typeof MediaSource !== 'undefined') {
        patchTypeChecker(MediaSource, 'isTypeSupported', false);
    }
    patchDecodingInfo();
};

export const initCodecBlocking = (): void => {
    preference = readCachedPreference();
    if (isCodecPreferenceActive(preference)) {
        patchCodecSupport();
    }

    document.addEventListener(CODEC_PREFERENCE_EVENT, (event) => {
        const change = parseCodecPreferenceChange(
            event instanceof CustomEvent ? event.detail : null
        );
        if (!change) return;

        preference = { ...preference, [change.id]: change.enabled };
        if (isCodecPreferenceActive(preference)) {
            patchCodecSupport();
        }
    });
};

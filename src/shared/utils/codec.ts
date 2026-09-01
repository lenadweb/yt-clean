export const CODEC_PREFERENCE_EVENT = 'cln-yt-cust-codec-preference';

export const CODEC_PREFERENCE_IDS = ['forceH264', 'block60Fps'] as const;

export type CodecPreferenceId = (typeof CODEC_PREFERENCE_IDS)[number];

export type CodecPreference = Record<CodecPreferenceId, boolean>;

export interface CodecPreferenceChange {
    id: CodecPreferenceId;
    enabled: boolean;
}

export const DEFAULT_CODEC_PREFERENCE: CodecPreference = {
    forceH264: false,
    block60Fps: false,
};

const BLOCKED_CODECS_REGEXP = /vp0?[89]|av01/i;
const FRAMERATE_REGEXP = /framerate=([\d.]+)/i;
const MAX_FRAMERATE = 30;

export const isCodecPreferenceActive = (preference: CodecPreference): boolean =>
    CODEC_PREFERENCE_IDS.some((id) => preference[id]);

export const isFramerateBlocked = (
    framerate: unknown,
    preference: CodecPreference
): boolean =>
    preference.block60Fps &&
    typeof framerate === 'number' &&
    Number.isFinite(framerate) &&
    framerate > MAX_FRAMERATE;

export const isCodecTypeBlocked = (
    type: unknown,
    preference: CodecPreference
): boolean => {
    if (typeof type !== 'string') return false;

    if (preference.forceH264 && BLOCKED_CODECS_REGEXP.test(type)) return true;

    const framerate = FRAMERATE_REGEXP.exec(type);
    return framerate
        ? isFramerateBlocked(Number(framerate[1]), preference)
        : false;
};

const isSettingEnabled = (settings: Record<string, unknown>, id: string) =>
    (settings[id] as { enabled?: unknown } | undefined)?.enabled === true;

export const parseCodecPreference = (raw: string | null): CodecPreference => {
    if (!raw) return DEFAULT_CODEC_PREFERENCE;

    try {
        const settings = JSON.parse(raw) as Record<string, unknown> | null;
        if (!settings || settings.isEnabled === false) {
            return DEFAULT_CODEC_PREFERENCE;
        }

        return {
            forceH264: isSettingEnabled(settings, 'forceH264'),
            block60Fps: isSettingEnabled(settings, 'block60Fps'),
        };
    } catch {
        return DEFAULT_CODEC_PREFERENCE;
    }
};

export const parseCodecPreferenceChange = (
    detail: unknown
): CodecPreferenceChange | null => {
    if (typeof detail !== 'string') return null;

    try {
        const payload = JSON.parse(detail) as Partial<CodecPreferenceChange>;
        return CODEC_PREFERENCE_IDS.includes(payload.id as CodecPreferenceId) &&
            typeof payload.enabled === 'boolean'
            ? { id: payload.id as CodecPreferenceId, enabled: payload.enabled }
            : null;
    } catch {
        return null;
    }
};

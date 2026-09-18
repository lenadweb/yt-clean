export const ORIGINAL_AUDIO_EVENT = 'yt-clean:original-audio';

export type AudioTrack = Record<string, unknown> & { id?: unknown };

const ORIGINAL_TRACK_NAMES = [
    'original',
    'оригинал',
    'оригінал',
    'オリジナル',
    '原始',
    '原創',
    '원본',
    'origineel',
    'oryginał',
    'původní',
    'pôvodn',
    'αρχικό',
    'orijinal',
    'gốc',
    'asli',
    'מקורי',
    'أصلي',
    'मूल',
    'मूळ',
    'అసలు',
    'மூலம்',
    'মূল',
    'ต้นฉบับ',
];

export const decodeTrackTags = (id: unknown): string => {
    if (typeof id !== 'string') return '';

    const encoded = id.split(';')[1];
    if (!encoded) return '';

    try {
        return atob(encoded);
    } catch {
        return '';
    }
};

const getTrackName = (track: AudioTrack): string => {
    for (const value of Object.values(track)) {
        const name = (value as { name?: unknown } | null)?.name;
        if (value && typeof value === 'object' && typeof name === 'string') {
            return name;
        }
    }

    return '';
};

export const isOriginalTrack = (track: AudioTrack): boolean => {
    if (decodeTrackTags(track.id).includes('original')) return true;

    const name = getTrackName(track).toLocaleLowerCase();
    return ORIGINAL_TRACK_NAMES.some((word) => name.includes(word));
};

export const findOriginalTrack = (tracks: AudioTrack[]): AudioTrack | null =>
    tracks.find(isOriginalTrack) ?? null;

export const isOriginalAudioCached = (raw: string | null): boolean => {
    if (!raw) return false;

    try {
        const settings = JSON.parse(raw) as {
            isEnabled?: unknown;
            originalAudio?: { enabled?: unknown };
        } | null;

        return (
            settings?.isEnabled !== false &&
            settings?.originalAudio?.enabled === true
        );
    } catch {
        return false;
    }
};

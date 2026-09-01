import { describe, expect, it } from 'vitest';
import {
    DEFAULT_CODEC_PREFERENCE,
    isCodecPreferenceActive,
    isCodecTypeBlocked,
    isFramerateBlocked,
    parseCodecPreference,
    parseCodecPreferenceChange,
} from 'src/shared/utils/codec';

const forceH264 = { forceH264: true, block60Fps: false };
const block60Fps = { forceH264: false, block60Fps: true };

const cache = (settings: Record<string, unknown>): string =>
    JSON.stringify(settings);

describe('isCodecTypeBlocked', () => {
    it('blocks vp8, vp9 and av1 when H.264 is forced', () => {
        [
            'video/webm; codecs="vp8, vorbis"',
            'video/webm; codecs="vp9"',
            'video/webm; codecs="vp09.00.10.08"',
            'video/mp4; codecs="av01.0.05M.08"',
        ].forEach((type) => {
            expect(isCodecTypeBlocked(type, forceH264)).toBe(true);
        });
    });

    it('keeps H.264 available', () => {
        expect(
            isCodecTypeBlocked('video/mp4; codecs="avc1.4d401f"', forceH264)
        ).toBe(false);
    });

    it('ignores codecs when H.264 is not forced', () => {
        expect(isCodecTypeBlocked('video/webm; codecs="vp9"', block60Fps)).toBe(
            false
        );
    });

    it('blocks high framerate types', () => {
        expect(
            isCodecTypeBlocked(
                'video/mp4; codecs="avc1.4d401f"; framerate=60',
                block60Fps
            )
        ).toBe(true);
        expect(
            isCodecTypeBlocked(
                'video/mp4; codecs="avc1.4d401f"; framerate=30',
                block60Fps
            )
        ).toBe(false);
    });

    it('ignores non-string types', () => {
        expect(isCodecTypeBlocked(undefined, forceH264)).toBe(false);
    });
});

describe('isFramerateBlocked', () => {
    it('blocks numeric framerates above 30 only when enabled', () => {
        expect(isFramerateBlocked(60, block60Fps)).toBe(true);
        expect(isFramerateBlocked(24, block60Fps)).toBe(false);
        expect(isFramerateBlocked(60, forceH264)).toBe(false);
        expect(isFramerateBlocked('60', block60Fps)).toBe(false);
    });
});

describe('parseCodecPreference', () => {
    it('reads enabled features from the settings cache', () => {
        expect(
            parseCodecPreference(
                cache({
                    isEnabled: true,
                    forceH264: { enabled: true },
                    block60Fps: { enabled: false },
                })
            )
        ).toEqual(forceH264);
    });

    it('returns defaults when the extension is off', () => {
        expect(
            parseCodecPreference(
                cache({ isEnabled: false, forceH264: { enabled: true } })
            )
        ).toEqual(DEFAULT_CODEC_PREFERENCE);
    });

    it('returns defaults for missing or broken cache', () => {
        expect(parseCodecPreference(null)).toEqual(DEFAULT_CODEC_PREFERENCE);
        expect(parseCodecPreference('{oops')).toEqual(DEFAULT_CODEC_PREFERENCE);
    });
});

describe('parseCodecPreferenceChange', () => {
    it('accepts known feature ids', () => {
        expect(
            parseCodecPreferenceChange(
                JSON.stringify({ id: 'block60Fps', enabled: true })
            )
        ).toEqual({ id: 'block60Fps', enabled: true });
    });

    it('rejects unknown payloads', () => {
        expect(
            parseCodecPreferenceChange(
                JSON.stringify({ id: 'somethingElse', enabled: true })
            )
        ).toBeNull();
        expect(parseCodecPreferenceChange(null)).toBeNull();
    });
});

describe('isCodecPreferenceActive', () => {
    it('is active when any toggle is on', () => {
        expect(isCodecPreferenceActive(DEFAULT_CODEC_PREFERENCE)).toBe(false);
        expect(isCodecPreferenceActive(block60Fps)).toBe(true);
    });
});

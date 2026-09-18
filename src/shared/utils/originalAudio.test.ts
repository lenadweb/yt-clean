import { describe, expect, it } from 'vitest';
import {
    decodeTrackTags,
    findOriginalTrack,
    isOriginalAudioCached,
    isOriginalTrack,
} from 'src/shared/utils/originalAudio';

const encode = (value: string) => btoa(value);

describe('decodeTrackTags', () => {
    it('decodes the tag part of a track id', () => {
        expect(decodeTrackTags(`251;${encode('acont=original')}`)).toBe(
            'acont=original'
        );
    });

    it('returns an empty string for ids without tags', () => {
        expect(decodeTrackTags('en.4')).toBe('');
        expect(decodeTrackTags(undefined)).toBe('');
        expect(decodeTrackTags('251;%%%')).toBe('');
    });
});

describe('isOriginalTrack', () => {
    it('detects the original track by its tags', () => {
        expect(isOriginalTrack({ id: `1;${encode('acont=original')}` })).toBe(
            true
        );
        expect(
            isOriginalTrack({ id: `2;${encode('acont=dubbed-auto')}` })
        ).toBe(false);
    });

    it('falls back to the localized track name', () => {
        expect(
            isOriginalTrack({ id: 'x', info: { name: 'English (original)' } })
        ).toBe(true);
        expect(
            isOriginalTrack({ id: 'y', info: { name: 'Русский (оригинал)' } })
        ).toBe(true);
        expect(isOriginalTrack({ id: 'z', info: { name: 'Deutsch' } })).toBe(
            false
        );
    });
});

describe('findOriginalTrack', () => {
    it('returns the original track among dubbed ones', () => {
        const dubbed = { id: `1;${encode('acont=dubbed-auto')}` };
        const original = { id: `2;${encode('acont=original')}` };

        expect(findOriginalTrack([dubbed, original])).toBe(original);
        expect(findOriginalTrack([dubbed])).toBeNull();
    });
});

describe('isOriginalAudioCached', () => {
    it('reads the cached setting', () => {
        expect(
            isOriginalAudioCached(
                JSON.stringify({ originalAudio: { enabled: true } })
            )
        ).toBe(true);
        expect(
            isOriginalAudioCached(
                JSON.stringify({
                    isEnabled: false,
                    originalAudio: { enabled: true },
                })
            )
        ).toBe(false);
        expect(isOriginalAudioCached(null)).toBe(false);
        expect(isOriginalAudioCached('{')).toBe(false);
    });
});

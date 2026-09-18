import { describe, expect, it } from 'vitest';
import {
    getOembedUrl,
    getVideoIdFromUrl,
    normalizeTitle,
} from 'src/shared/utils/originalTitles';

describe('getVideoIdFromUrl', () => {
    it('extracts the id from relative and absolute watch links', () => {
        expect(getVideoIdFromUrl('/watch?v=tsNPBCLNkj0')).toBe('tsNPBCLNkj0');
        expect(
            getVideoIdFromUrl(
                'https://www.youtube.com/watch?v=4Ba7HOf4gVk&pp=0gcJCUELAYcqIYzv'
            )
        ).toBe('4Ba7HOf4gVk');
    });

    it('ignores non-video links', () => {
        expect(getVideoIdFromUrl('/shorts/tsNPBCLNkj0')).toBeNull();
        expect(getVideoIdFromUrl('/playlist?list=PL123')).toBeNull();
        expect(getVideoIdFromUrl('/watch?v=short')).toBeNull();
        expect(getVideoIdFromUrl(null)).toBeNull();
    });
});

describe('getOembedUrl', () => {
    it('builds the oEmbed request url', () => {
        expect(getOembedUrl('tsNPBCLNkj0')).toBe(
            'https://www.youtube.com/oembed?format=json&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DtsNPBCLNkj0'
        );
    });
});

describe('normalizeTitle', () => {
    it('collapses whitespace', () => {
        expect(normalizeTitle('  Top\n 10   fails ')).toBe('Top 10 fails');
    });
});

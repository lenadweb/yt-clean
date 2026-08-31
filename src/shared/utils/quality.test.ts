import { describe, expect, it } from 'vitest';
import { selectEnhancedBitrateFormat } from 'src/shared/utils/quality';

describe('selectEnhancedBitrateFormat', () => {
    it('selects the highest ranked premium format', () => {
        expect(
            selectEnhancedBitrateFormat([
                {
                    quality: 'hd1080',
                    formatId: 721,
                    paygatedQualityDetails: { label: 'Premium' },
                },
                {
                    quality: 'hd2160',
                    formatId: 401,
                    paygatedQualityDetails: { label: 'Premium' },
                },
                { quality: 'hd2160', formatId: 315 },
            ])
        ).toEqual({ quality: 'hd2160', formatId: 401 });
    });

    it('ignores normal and malformed formats', () => {
        expect(
            selectEnhancedBitrateFormat([
                { quality: 'hd1080', formatId: 399 },
                { quality: 'hd1080', paygatedQualityDetails: {} },
                null,
            ])
        ).toBeNull();
    });
});

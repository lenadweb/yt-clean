import { describe, expect, it } from 'vitest';
import { parseSpeed } from 'src/shared/utils/yt';

describe('parseSpeed', () => {
    it('parses a stored speed string', () => {
        expect(parseSpeed('1.00')).toBe(1);
        expect(parseSpeed('1.5')).toBe(1.5);
        expect(parseSpeed('0.333')).toBe(0.33);
    });

    it('falls back to 1 for invalid values', () => {
        expect(parseSpeed(undefined)).toBe(1);
        expect(parseSpeed('')).toBe(1);
        expect(parseSpeed('abc')).toBe(1);
        expect(parseSpeed('0')).toBe(1);
        expect(parseSpeed('-2')).toBe(1);
    });
});

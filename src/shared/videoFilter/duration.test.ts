import { describe, expect, it } from 'vitest';
import {
    DURATION_STOPS,
    getStopIndex,
    isDurationFilterActive,
    isDurationOutOfRange,
    parseDuration,
} from 'src/shared/videoFilter/duration';

describe('parseDuration', () => {
    it('parses minute and hour badges', () => {
        expect(parseDuration('7:36')).toBe(456);
        expect(parseDuration(' 18:57 ')).toBe(1137);
        expect(parseDuration('1:02:03')).toBe(3723);
    });

    it('ignores badges without a duration', () => {
        expect(parseDuration('LIVE')).toBeNull();
        expect(parseDuration('')).toBeNull();
        expect(parseDuration('12')).toBeNull();
    });
});

describe('isDurationFilterActive', () => {
    it('is inactive for the full range or when disabled', () => {
        expect(
            isDurationFilterActive({ enabled: true, min: 0, max: null })
        ).toBe(false);
        expect(
            isDurationFilterActive({ enabled: false, min: 5, max: 30 })
        ).toBe(false);
    });

    it('is active when a bound is set', () => {
        expect(
            isDurationFilterActive({ enabled: true, min: 5, max: null })
        ).toBe(true);
        expect(isDurationFilterActive({ enabled: true, min: 0, max: 30 })).toBe(
            true
        );
    });
});

describe('isDurationOutOfRange', () => {
    const setting = { enabled: true, min: 5, max: 30 };

    it('hides videos outside of the range', () => {
        expect(isDurationOutOfRange(4 * 60 + 59, setting)).toBe(true);
        expect(isDurationOutOfRange(30 * 60 + 1, setting)).toBe(true);
    });

    it('keeps videos inside the range including bounds', () => {
        expect(isDurationOutOfRange(5 * 60, setting)).toBe(false);
        expect(isDurationOutOfRange(30 * 60, setting)).toBe(false);
    });

    it('has no upper bound when max is null', () => {
        expect(isDurationOutOfRange(10 * 3600, { ...setting, max: null })).toBe(
            false
        );
    });
});

describe('getStopIndex', () => {
    it('maps minutes to the closest stop at or above', () => {
        expect(getStopIndex(0)).toBe(0);
        expect(DURATION_STOPS[getStopIndex(5)]).toBe(5);
        expect(DURATION_STOPS[getStopIndex(7)]).toBe(10);
        expect(getStopIndex(null)).toBe(DURATION_STOPS.length - 1);
    });
});

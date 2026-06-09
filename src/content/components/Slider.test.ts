import { describe, expect, it } from 'vitest';
import {
    clamp,
    getSteppedValue,
    getValuePercent,
} from 'src/content/components/Slider';

describe('clamp', () => {
    it('keeps values within bounds', () => {
        expect(clamp(5, 0, 10)).toBe(5);
        expect(clamp(-1, 0, 10)).toBe(0);
        expect(clamp(11, 0, 10)).toBe(10);
    });
});

describe('getValuePercent', () => {
    it('maps a value to a 0-100 percentage', () => {
        expect(getValuePercent(0.3, 0.3, 2.5)).toBe(0);
        expect(getValuePercent(2.5, 0.3, 2.5)).toBe(100);
        expect(getValuePercent(1.4, 0.3, 2.5)).toBeCloseTo(50, 5);
    });

    it('clamps out-of-range values', () => {
        expect(getValuePercent(5, 0.3, 2.5)).toBe(100);
        expect(getValuePercent(0, 0.3, 2.5)).toBe(0);
    });
});

describe('getSteppedValue', () => {
    it('snaps a drag fraction to the nearest step', () => {
        expect(getSteppedValue(0, 0.3, 2.5, 0.05)).toBeCloseTo(0.3, 5);
        expect(getSteppedValue(1, 0.3, 2.5, 0.05)).toBeCloseTo(2.5, 5);
        expect(getSteppedValue(0.5, 1, 3, 0.1)).toBeCloseTo(2, 5);
    });
});

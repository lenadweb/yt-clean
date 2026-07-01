import { describe, expect, it } from 'vitest';
import {
    CATEGORIES,
    FEATURES,
    SECTIONS,
    getComponentGroups,
} from 'src/shared/featureConfig';
import { DEFAULT_STORAGE } from 'src/shared/storage/config';
import { BASE_ATTR_PREFIX } from 'src/shared/const';

const storageKeys = new Set(Object.keys(DEFAULT_STORAGE));

describe('FEATURES', () => {
    it('builds a non-empty feature list', () => {
        expect(FEATURES.length).toBeGreaterThan(0);
    });

    it('gives every action a prefixed body attribute', () => {
        const actions = FEATURES.flatMap((f) => f.actions);
        expect(actions.length).toBeGreaterThan(0);
        actions.forEach((action) => {
            expect(action.attr.startsWith(`${BASE_ATTR_PREFIX}-`)).toBe(true);
        });
    });

    it('has no duplicated feature ids', () => {
        const ids = FEATURES.map((feature) => feature.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('only references settings ids that exist in storage defaults', () => {
        FEATURES.forEach((feature) => {
            expect(storageKeys.has(feature.id)).toBe(true);
        });
    });

    it('generates one default setting per feature', () => {
        const nonFeatureKeys = [
            'isEnabled',
            'activePreset',
            'presets',
            'presetWarningDismissed',
        ];
        expect(storageKeys.size).toBe(FEATURES.length + nonFeatureKeys.length);
    });
});

describe('CATEGORIES', () => {
    it('exposes every feature through a category and section', () => {
        expect(CATEGORIES.length).toBeGreaterThan(0);

        const featureCount = CATEGORIES.flatMap((c) => c.sections).flatMap(
            (s) => s.features
        ).length;

        expect(featureCount).toBe(FEATURES.length);
    });

    it('gives every section action a prefixed body attribute', () => {
        SECTIONS.flatMap(
            (section) => section.onFullGroupEnabledActions ?? []
        ).forEach((action) => {
            expect(action.attr.startsWith(`${BASE_ATTR_PREFIX}-`)).toBe(true);
        });
    });
});

describe('getComponentGroups', () => {
    it('returns component groups bound to known settings ids', () => {
        getComponentGroups().forEach((group) => {
            expect(storageKeys.has(group.id)).toBe(true);
            expect(group.components.length).toBeGreaterThan(0);
        });
    });
});

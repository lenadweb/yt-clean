import { describe, expect, it } from 'vitest';
import {
    FEATURES,
    getComponentsAction,
    getSettingsCategories,
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

    it('only references settings ids that exist in storage defaults', () => {
        FEATURES.forEach((feature) => {
            expect(storageKeys.has(feature.id)).toBe(true);
        });
    });
});

describe('getSettingsCategories', () => {
    it('exposes every feature through a category and section', () => {
        const categories = getSettingsCategories();
        expect(categories.length).toBeGreaterThan(0);

        const featureCount = categories
            .flatMap((c) => c.settings)
            .flatMap((s) => s.groups).length;

        expect(featureCount).toBe(FEATURES.length);
    });
});

describe('getComponentsAction', () => {
    it('returns component groups bound to known settings ids', () => {
        getComponentsAction().forEach((group) => {
            expect(storageKeys.has(group.id)).toBe(true);
            expect(group.components.length).toBeGreaterThan(0);
        });
    });
});

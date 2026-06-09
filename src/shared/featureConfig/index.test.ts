import { describe, expect, it } from 'vitest';
import {
    CONFIG,
    getComponentsAction,
    getSettingsCategories,
} from 'src/shared/featureConfig';
import { DEFAULT_STORAGE } from 'src/shared/storage/config';
import { BASE_ATTR_PREFIX } from 'src/shared/const';

const storageKeys = new Set(Object.keys(DEFAULT_STORAGE));

describe('CONFIG', () => {
    it('builds a non-empty feature list', () => {
        expect(CONFIG.features.length).toBeGreaterThan(0);
    });

    it('gives every action a prefixed body attribute', () => {
        const actions = CONFIG.features.flatMap((f) => f.actions);
        expect(actions.length).toBeGreaterThan(0);
        actions.forEach((action) => {
            expect(action.attr.startsWith(`${BASE_ATTR_PREFIX}-`)).toBe(true);
        });
    });

    it('only references settings ids that exist in storage defaults', () => {
        CONFIG.features.forEach((feature) => {
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

        expect(featureCount).toBe(CONFIG.features.length);
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

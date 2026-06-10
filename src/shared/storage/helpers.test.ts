import { describe, expect, it } from 'vitest';
import { DEFAULT_STORAGE } from 'src/shared/storage/config';
import {
    applyStorageChanges,
    mergeStorage,
    StorageChanges,
} from 'src/shared/storage/helpers';

describe('mergeStorage', () => {
    it('keeps defaults when no stored data is provided', () => {
        expect(mergeStorage(DEFAULT_STORAGE, {})).toEqual(DEFAULT_STORAGE);
    });

    it('overrides defaults with stored values', () => {
        const merged = mergeStorage(DEFAULT_STORAGE, {
            isEnabled: false,
            hideShorts: { enabled: true },
        });

        expect(merged.isEnabled).toBe(false);
        expect(merged.hideShorts).toEqual({ enabled: true });
        expect(merged.hideJams).toEqual(DEFAULT_STORAGE.hideJams);
    });

    it('keeps new default fields inside stored settings', () => {
        const defaults = {
            ...DEFAULT_STORAGE,
            speedControl: { enabled: false, value: '1.00' },
        };

        const merged = mergeStorage(defaults, {
            speedControl: { enabled: true },
        });

        expect(merged.speedControl).toEqual({ enabled: true, value: '1.00' });
    });
});

describe('applyStorageChanges', () => {
    it('applies new values from a change set', () => {
        const changes: StorageChanges = {
            hideShorts: {
                oldValue: { enabled: false },
                newValue: { enabled: true },
            },
        };

        const next = applyStorageChanges(
            DEFAULT_STORAGE,
            changes,
            DEFAULT_STORAGE
        );

        expect(next.hideShorts).toEqual({ enabled: true });
        expect(next).not.toBe(DEFAULT_STORAGE);
    });

    it('falls back to defaults when a change has no new value', () => {
        const changes: StorageChanges = {
            speedControl: { oldValue: { enabled: true, value: '2' } } as never,
        };

        const next = applyStorageChanges(
            { ...DEFAULT_STORAGE, speedControl: { enabled: true, value: '2' } },
            changes,
            DEFAULT_STORAGE
        );

        expect(next.speedControl).toEqual(DEFAULT_STORAGE.speedControl);
    });
});

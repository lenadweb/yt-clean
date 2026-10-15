import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Storage } from 'src/shared/storage';
import { DEFAULT_STORAGE } from 'src/shared/storage/config';

describe('navigation preference and cleanup presets', () => {
    let settings: Storage;

    beforeEach(() => {
        vi.stubGlobal('chrome', { storage: { local: { set: vi.fn() } } });
        settings = new Storage(structuredClone(DEFAULT_STORAGE));
    });

    afterEach(() => vi.unstubAllGlobals());

    it('keeps the Home redirect when switching and resetting presets', () => {
        settings.setFeatures({
            redirectHomeToSubscriptions: { enabled: true },
        });
        settings.applyPreset('light');
        settings.resetActivePreset();
        settings.applyPreset('custom');
        settings.applyPreset('balanced');
        expect(settings.settings.redirectHomeToSubscriptions.enabled).toBe(
            true
        );
    });

    it('does not reactivate navigation from a saved preset after it is disabled', () => {
        settings.setFeatures({
            redirectHomeToSubscriptions: { enabled: true },
        });
        settings.applyPreset('light');
        settings.setFeatures({
            redirectHomeToSubscriptions: { enabled: false },
        });
        settings.applyPreset('balanced');
        expect(settings.settings.redirectHomeToSubscriptions.enabled).toBe(
            false
        );
    });

    it('ignores global preferences saved in older preset data', () => {
        settings.settings.presets.light.originalAudio = { enabled: true };
        settings.settings.originalAudio = { enabled: false };
        settings.applyPreset('light');
        expect(settings.settings.originalAudio.enabled).toBe(false);
    });
});

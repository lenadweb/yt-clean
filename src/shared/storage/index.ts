import {
    DEFAULT_STORAGE,
    SettingsState,
    StorageState,
} from 'src/shared/storage/config';
import {
    applyStorageChanges,
    mergeStorage,
    StorageChanges,
} from 'src/shared/storage/helpers';
import {
    getPresetConfig,
    MANAGED_FEATURE_IDS,
    PRESET_DEFAULTS,
    PresetId,
} from 'src/shared/presets';

type Listener = (changes?: StorageChanges) => void;

export class Storage {
    settings: StorageState;
    isReady = false;
    private initialized = false;
    private readonly listeners = new Set<Listener>();

    constructor(private readonly defaults: StorageState = DEFAULT_STORAGE) {
        this.settings = { ...defaults };
    }

    init(): void {
        if (this.initialized) return;
        this.initialized = true;

        chrome.storage.local.get(null, (data) => {
            this.settings = mergeStorage(
                this.defaults,
                data as Partial<StorageState>
            );

            if ((data as Partial<StorageState>).activePreset === undefined) {
                this.migrateToPresets();
            }

            chrome.storage.local.set(this.settings);
            this.isReady = true;
            this.notify();
        });

        chrome.storage.onChanged.addListener((changes) => {
            const storageChanges = changes as StorageChanges;
            this.settings = applyStorageChanges(
                this.settings,
                storageChanges,
                this.defaults
            );
            this.notify(storageChanges);
        });
    }

    private migrateToPresets(): void {
        const customConfig = Object.fromEntries(
            MANAGED_FEATURE_IDS.map((id) => [
                id,
                this.settings[id as keyof StorageState] ?? { enabled: false },
            ])
        ) as SettingsState;

        this.settings.activePreset = 'custom';
        this.settings.presets = {
            ...this.settings.presets,
            custom: customConfig,
        };
    }

    update<K extends keyof StorageState>(key: K, value: StorageState[K]): void {
        const oldValue = this.settings[key];
        this.settings = { ...this.settings, [key]: value };
        chrome.storage.local.set({ [key]: value });
        this.notify({ [key]: { oldValue, newValue: value } } as StorageChanges);
    }

    updateMany(partial: Partial<StorageState>): void {
        const changes = Object.fromEntries(
            (Object.keys(partial) as Array<keyof StorageState>).map((key) => [
                key,
                { oldValue: this.settings[key], newValue: partial[key] },
            ])
        ) as StorageChanges;

        this.settings = { ...this.settings, ...partial };
        chrome.storage.local.set(partial);
        this.notify(changes);
    }

    setFeatures(values: Partial<SettingsState>): void {
        const presetId = this.settings.activePreset;
        const presets = {
            ...this.settings.presets,
            [presetId]: { ...this.settings.presets[presetId], ...values },
        };

        this.updateMany({ ...values, presets } as Partial<StorageState>);
    }

    applyPreset(presetId: PresetId): void {
        const config = getPresetConfig(presetId, this.settings.presets);
        this.updateMany({ ...config, activePreset: presetId });
    }

    resetActivePreset(): void {
        const presetId = this.settings.activePreset;
        const config = PRESET_DEFAULTS[presetId];
        const presets = { ...this.settings.presets, [presetId]: config };
        this.updateMany({ ...config, presets });
    }

    onChange(listener: Listener): () => void {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }

    private notify(changes?: StorageChanges): void {
        this.listeners.forEach((listener) => listener(changes));
    }
}

export const storage = new Storage();

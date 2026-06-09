import { DEFAULT_STORAGE, IStorage } from 'src/shared/storage/config';
import {
    applyStorageChanges,
    mergeStorage,
    StorageChanges,
} from 'src/shared/storage/helpers';

type Listener = (changes?: StorageChanges) => void;

/**
 * Single source of truth for extension settings. Mirrors `chrome.storage.local`
 * in memory, applies defaults, and notifies subscribers on every change.
 * One instance per execution context (see the `storage` singleton below) is
 * shared by both the imperative DOM layer and the React UI.
 */
export class Storage {
    settings: IStorage;
    isReady = false;
    private readonly listeners = new Set<Listener>();

    constructor(private readonly defaults: IStorage = DEFAULT_STORAGE) {
        this.settings = { ...defaults };

        chrome.storage.local.get(null, (data) => {
            this.settings = mergeStorage(defaults, data as Partial<IStorage>);
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

    update<K extends keyof IStorage>(key: K, value: IStorage[K]): void {
        this.settings = { ...this.settings, [key]: value };
        chrome.storage.local.set({ [key]: value });
        this.notify();
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

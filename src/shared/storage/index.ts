import { DEFAULT_STORAGE, StorageState } from 'src/shared/storage/config';
import {
    applyStorageChanges,
    mergeStorage,
    StorageChanges,
} from 'src/shared/storage/helpers';

type Listener = (changes?: StorageChanges) => void;

export class Storage {
    settings: StorageState;
    isReady = false;
    private readonly listeners = new Set<Listener>();

    constructor(private readonly defaults: StorageState = DEFAULT_STORAGE) {
        this.settings = { ...defaults };

        chrome.storage.local.get(null, (data) => {
            this.settings = mergeStorage(
                defaults,
                data as Partial<StorageState>
            );
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

    update<K extends keyof StorageState>(key: K, value: StorageState[K]): void {
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

import { DEFAULT_STORAGE, IStorage } from 'src/shared/storage/config';
import {
    applyStorageChanges,
    mergeStorage,
    StorageChanges,
} from 'src/shared/storage/helpers';
import StorageChange = chrome.storage.StorageChange;

export class Storage {
    settings: IStorage;
    private listeners: ((changes?: StorageChanges) => void)[] = [];

    constructor(private readonly defaults: IStorage = DEFAULT_STORAGE) {
        this.settings = { ...defaults };
        chrome.storage.local.get(null, (data) => {
            this.settings = mergeStorage(defaults, data as Partial<IStorage>);
            chrome.storage.local.set(this.settings);
            this.notifyListeners();
        });

        chrome.storage.onChanged.addListener(
            (changes: Record<string, StorageChange>) => {
                const storageChanges = changes as StorageChanges;

                this.settings = applyStorageChanges(
                    this.settings,
                    storageChanges,
                    this.defaults
                );
                this.notifyListeners(storageChanges);
            }
        );
    }

    update<K extends keyof IStorage>(key: K, value: IStorage[K]): void {
        this.settings[key] = value;
        chrome.storage.local.set({ [key]: value });
        this.notifyListeners();
    }

    get<K extends keyof IStorage>(key: K): IStorage[K] {
        return this.settings[key];
    }

    onChange(callback: (changes?: StorageChanges) => void): void {
        this.listeners.push(callback);
    }

    private notifyListeners(changes?: StorageChanges): void {
        this.listeners.forEach((cb) => cb(changes));
    }
}

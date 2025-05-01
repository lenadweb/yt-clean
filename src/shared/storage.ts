import { IStorage } from 'src/shared/storage/config';
import { ISettings } from 'src/shared/types/settings';
import StorageChange = chrome.storage.StorageChange;

export class Storage {
    settings: IStorage;
    private listeners: ((
        changes?: Record<keyof IStorage, StorageChange>
    ) => void)[] = [];

    constructor(defaults: IStorage) {
        this.settings = { ...defaults };
        chrome.storage.local.get(null, (data) => {
            this.settings = { ...defaults, ...data };
            chrome.storage.local.set(this.settings);
            this.notifyListeners();
        });

        chrome.storage.onChanged.addListener(
            // @ts-ignore
            (changes: Record<keyof IStorage, StorageChange>) => {
                // @ts-ignore
                Object.keys(changes).forEach((key: keyof ISettings) => {
                    this.settings[key] = changes[key].newValue ?? defaults[key];
                });
                this.notifyListeners(changes);
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

    onChange(
        callback: (changes?: Record<keyof IStorage, StorageChange>) => void
    ): void {
        this.listeners.push(callback);
    }

    private notifyListeners(
        changes?: Record<keyof IStorage, StorageChange>
    ): void {
        this.listeners.forEach((cb) => cb(changes));
    }
}

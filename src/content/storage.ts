import { IStorage } from 'src/shared/storage/config';
import { ISettings } from 'src/shared/types/settings';

export class Storage {
    settings: IStorage;
    private listeners: (() => void)[] = [];

    constructor(defaults: IStorage) {
        this.settings = { ...defaults };
        chrome.storage.local.get(null, (data) => {
            this.settings = { ...defaults, ...data };
            chrome.storage.local.set(this.settings);
            this.notifyListeners();
        });

        chrome.storage.onChanged.addListener((changes) => {
            // @ts-ignore
            Object.keys(changes).forEach((key: keyof ISettings) => {
                this.settings[key] = changes[key].newValue ?? defaults[key];
            });
            this.notifyListeners();
        });
    }

    update<K extends keyof IStorage>(key: K, value: IStorage[K]): void {
        this.settings[key] = value;
        chrome.storage.local.set({ [key]: value });
        this.notifyListeners();
    }

    get<K extends keyof IStorage>(key: K): IStorage[K] {
        return this.settings[key];
    }

    onChange(callback: () => void): void {
        this.listeners.push(callback);
    }

    private notifyListeners(): void {
        this.listeners.forEach((cb) => cb());
    }
}

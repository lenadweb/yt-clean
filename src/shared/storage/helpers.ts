import { IStorage } from 'src/shared/storage/config';

export type StorageChanges = Partial<
    Record<keyof IStorage, chrome.storage.StorageChange>
>;

type StorageSetting = Record<string, unknown>;

export const mergeStorage = (
    defaults: IStorage,
    data: Partial<IStorage>
): IStorage => {
    const storage = { ...defaults, ...data };

    (Object.keys(defaults) as Array<keyof IStorage>).forEach((key) => {
        const defaultValue = defaults[key];
        const storedValue = data[key];

        if (isSetting(defaultValue) && isSetting(storedValue)) {
            storage[key] = mergeSetting(defaultValue, storedValue) as never;
        }
    });

    return storage;
};

const mergeSetting = (
    defaultValue: StorageSetting,
    storedValue: StorageSetting
): StorageSetting => ({
    ...defaultValue,
    ...storedValue,
});

const isSetting = (value: unknown): value is StorageSetting =>
    Boolean(value && typeof value === 'object' && !Array.isArray(value));

const getChangeValue = <K extends keyof IStorage>(
    changes: StorageChanges,
    defaults: IStorage,
    key: K
): IStorage[K] => (changes[key]?.newValue ?? defaults[key]) as IStorage[K];

const applyStorageValue = <K extends keyof IStorage>(
    settings: IStorage,
    key: K,
    value: IStorage[K]
) => {
    settings[key] = value;
};

export const applyStorageChanges = (
    settings: IStorage,
    changes: StorageChanges,
    defaults: IStorage
): IStorage => {
    const nextSettings = { ...settings };

    (Object.keys(changes) as Array<keyof IStorage>).forEach((key) => {
        applyStorageValue(
            nextSettings,
            key,
            getChangeValue(changes, defaults, key)
        );
    });

    return nextSettings;
};

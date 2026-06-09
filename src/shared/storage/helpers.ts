import { IStorage } from 'src/shared/storage/config';

export type StorageChanges = Partial<
    Record<keyof IStorage, chrome.storage.StorageChange>
>;

export const mergeStorage = (
    defaults: IStorage,
    data: Partial<IStorage>
): IStorage => ({
    ...defaults,
    ...data,
});

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

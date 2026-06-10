import { StorageState } from 'src/shared/storage/config';

export type StorageChanges = Partial<
    Record<keyof StorageState, chrome.storage.StorageChange>
>;

export const mergeStorage = (
    defaults: StorageState,
    data: Partial<StorageState>
): StorageState => ({
    ...defaults,
    ...data,
});

const getChangeValue = <K extends keyof StorageState>(
    changes: StorageChanges,
    defaults: StorageState,
    key: K
): StorageState[K] =>
    (changes[key]?.newValue ?? defaults[key]) as StorageState[K];

const applyStorageValue = <K extends keyof StorageState>(
    settings: StorageState,
    key: K,
    value: StorageState[K]
) => {
    settings[key] = value;
};

export const applyStorageChanges = (
    settings: StorageState,
    changes: StorageChanges,
    defaults: StorageState
): StorageState => {
    const nextSettings = { ...settings };

    (Object.keys(changes) as Array<keyof StorageState>).forEach((key) => {
        applyStorageValue(
            nextSettings,
            key,
            getChangeValue(changes, defaults, key)
        );
    });

    return nextSettings;
};

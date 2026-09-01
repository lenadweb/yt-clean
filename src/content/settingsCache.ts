import { StorageState } from 'src/shared/storage/config';
import { SETTINGS_CACHE_KEY } from 'src/shared/const';

export const readCachedSettings = (): StorageState | null => {
    try {
        const raw = window.localStorage.getItem(SETTINGS_CACHE_KEY);
        return raw ? (JSON.parse(raw) as StorageState) : null;
    } catch {
        return null;
    }
};

export const writeCachedSettings = (settings: StorageState): void => {
    try {
        window.localStorage.setItem(
            SETTINGS_CACHE_KEY,
            JSON.stringify(settings)
        );
    } catch {
        // localStorage may be unavailable (private mode / quota) — ignore
    }
};

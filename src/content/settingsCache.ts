import { StorageState } from 'src/shared/storage/config';

const CACHE_KEY = '__yt_clean_settings__';

export const readCachedSettings = (): StorageState | null => {
    try {
        const raw = window.localStorage.getItem(CACHE_KEY);
        return raw ? (JSON.parse(raw) as StorageState) : null;
    } catch {
        return null;
    }
};

export const writeCachedSettings = (settings: StorageState): void => {
    try {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(settings));
    } catch {
        // localStorage may be unavailable (private mode / quota) — ignore
    }
};

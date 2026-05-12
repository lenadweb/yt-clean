import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { DEFAULT_STORAGE, IStorage } from 'src/shared/storage/config';

type UpdateSetting = <K extends keyof IStorage>(
    key: K,
    value: IStorage[K]
) => void;

const StorageContext = createContext<[IStorage, UpdateSetting] | null>(null);

export const useStorage = (): [IStorage, UpdateSetting] => {
    const context = useContext(StorageContext);
    if (!context) {
        throw new Error('useStorage must be used within a StorageProvider');
    }
    return context;
};

export const useStorageValue = <K extends keyof IStorage>(
    key: K
): [IStorage[K], (value: IStorage[K]) => void] => {
    const context = useContext(StorageContext);
    if (!context) {
        throw new Error('useStorage must be used within a StorageProvider');
    }
    const [settings, updateSetting] = context;

    const value = settings[key];
    const setValue = useCallback(
        (v: IStorage[K]) => updateSetting(key, v),
        [key, updateSetting]
    );

    return [value, setValue];
};

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isInit, setIsInit] = useState(false);
    const [settings, setSettings] = useState<IStorage>(DEFAULT_STORAGE);

    useEffect(() => {
        chrome.storage.local.get(null, (data) => {
            const mergedSettings = { ...DEFAULT_STORAGE, ...data };
            setSettings(mergedSettings);
            setIsInit(true);
            chrome.storage.local.set(mergedSettings);
        });

        const handleStorageChange = (
            changes: Record<string, chrome.storage.StorageChange>
        ) => {
            setSettings((prev) => ({
                ...prev,
                ...Object.keys(changes).reduce(
                    (acc, key) => ({
                        ...acc,
                        // @ts-ignore
                        [key]: changes[key]?.newValue ?? DEFAULT_STORAGE[key],
                    }),
                    {}
                ),
            }));
        };

        chrome.storage.onChanged.addListener(handleStorageChange);
        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };
    }, []);

    const updateSetting: UpdateSetting = useCallback((key, value) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
        chrome.storage.local.set({ [key]: value });
    }, []);

    if (!isInit) {
        return null;
    }

    return (
        <StorageContext.Provider value={[settings, updateSetting]}>
            {children}
        </StorageContext.Provider>
    );
};

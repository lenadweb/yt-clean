import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { IStorage } from 'src/shared/storage/config';
import { storage } from 'src/shared/storage';

type UpdateSetting = <K extends keyof IStorage>(
    key: K,
    value: IStorage[K]
) => void;

const updateSetting: UpdateSetting = (key, value) => storage.update(key, value);

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
    const [settings] = useStorage();
    const setValue = useCallback(
        (value: IStorage[K]) => updateSetting(key, value),
        [key]
    );

    return [settings[key], setValue];
};

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [settings, setSettings] = useState<IStorage>(storage.settings);
    const [isReady, setIsReady] = useState(storage.isReady);

    useEffect(() => {
        const sync = () => {
            setSettings({ ...storage.settings });
            setIsReady(storage.isReady);
        };

        const unsubscribe = storage.onChange(sync);
        sync(); // Catch state that loaded before this subscription.

        return unsubscribe;
    }, []);

    if (!isReady) {
        return null;
    }

    return (
        <StorageContext.Provider value={[settings, updateSetting]}>
            {children}
        </StorageContext.Provider>
    );
};

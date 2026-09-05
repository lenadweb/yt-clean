import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { StorageState } from 'src/shared/storage/config';
import { storage } from 'src/shared/storage';

type UpdateSetting = <K extends keyof StorageState>(
    key: K,
    value: StorageState[K]
) => void;

const updateSetting: UpdateSetting = (key, value) => storage.update(key, value);

const StorageContext = createContext<[StorageState, UpdateSetting] | null>(
    null
);

export const useStorage = (): [StorageState, UpdateSetting] => {
    const context = useContext(StorageContext);
    if (!context) {
        throw new Error('useStorage must be used within a StorageProvider');
    }
    return context;
};

export const useStorageValue = <K extends keyof StorageState>(
    key: K
): [StorageState[K], (value: StorageState[K]) => void] => {
    const [settings] = useStorage();
    const setValue = useCallback(
        (value: StorageState[K]) => updateSetting(key, value),
        [key]
    );

    return [settings[key], setValue];
};

type StorageProviderProps = {
    children: React.ReactNode;
    mockSettings?: StorageState;
};

export const StorageProvider: React.FC<StorageProviderProps> = ({
    children,
    mockSettings,
}) => {
    const [settings, setSettings] = useState<StorageState>(
        mockSettings ?? storage.settings
    );
    const [isReady, setIsReady] = useState(
        mockSettings !== undefined || storage.isReady
    );

    const updateContextSetting: UpdateSetting = useCallback(
        (key, value) => {
            if (mockSettings === undefined) {
                updateSetting(key, value);
                return;
            }

            setSettings((current) => ({ ...current, [key]: value }));
        },
        [mockSettings]
    );

    useEffect(() => {
        if (mockSettings !== undefined) {
            setSettings(mockSettings);
            setIsReady(true);
            return;
        }

        const sync = () => {
            setSettings({ ...storage.settings });
            setIsReady(storage.isReady);
        };

        const unsubscribe = storage.onChange(sync);
        sync();

        return unsubscribe;
    }, [mockSettings]);

    if (!isReady) {
        return null;
    }

    return (
        <StorageContext.Provider value={[settings, updateContextSetting]}>
            {children}
        </StorageContext.Provider>
    );
};

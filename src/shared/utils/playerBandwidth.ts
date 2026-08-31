const PLAYER_BANDWIDTH_KEY = 'yt-player-bandwidth';
const PLAYER_BANDWIDTH_BACKUP_KEY = 'cln-yt-cust-player-bandwidth-backup';
const SPOOFED_BYTERATE = 50_000_000;
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

type JsonObject = Record<string, unknown>;

const isJsonObject = (value: unknown): value is JsonObject =>
    Boolean(value && typeof value === 'object' && !Array.isArray(value));

const parseObject = (value: string | null): JsonObject | null => {
    if (!value) return null;

    try {
        const parsed = JSON.parse(value) as unknown;
        return isJsonObject(parsed) ? parsed : null;
    } catch {
        return null;
    }
};

export const createSpoofedPlayerBandwidth = (
    storedValue: string | null,
    now: number = Date.now()
): string => {
    const wrapper = parseObject(storedValue) ?? {};
    const storedData = wrapper.data;
    const dataWasObject = isJsonObject(storedData);
    const data = dataWasObject
        ? storedData
        : (parseObject(typeof storedData === 'string' ? storedData : null) ??
          {});

    const nextData = {
        ...data,
        delay: 0,
        stall: 0,
        byterate: SPOOFED_BYTERATE,
    };

    return JSON.stringify({
        ...wrapper,
        data: dataWasObject ? nextData : JSON.stringify(nextData),
        expiration: now + THIRTY_DAYS_MS,
        creation: now,
    });
};

export const enablePlayerBandwidthSpoofing = (): void => {
    try {
        const originalValue = window.localStorage.getItem(PLAYER_BANDWIDTH_KEY);

        if (window.localStorage.getItem(PLAYER_BANDWIDTH_BACKUP_KEY) === null) {
            window.localStorage.setItem(
                PLAYER_BANDWIDTH_BACKUP_KEY,
                JSON.stringify({ value: originalValue })
            );
        }

        window.localStorage.setItem(
            PLAYER_BANDWIDTH_KEY,
            createSpoofedPlayerBandwidth(originalValue)
        );
    } catch (error) {
        console.error('Unable to spoof YouTube player bandwidth:', error);
    }
};

export const disablePlayerBandwidthSpoofing = (): void => {
    try {
        const backupValue = window.localStorage.getItem(
            PLAYER_BANDWIDTH_BACKUP_KEY
        );
        if (backupValue === null) return;

        const backup = parseObject(backupValue);
        if (typeof backup?.value === 'string') {
            window.localStorage.setItem(PLAYER_BANDWIDTH_KEY, backup.value);
        } else {
            window.localStorage.removeItem(PLAYER_BANDWIDTH_KEY);
        }

        window.localStorage.removeItem(PLAYER_BANDWIDTH_BACKUP_KEY);
    } catch (error) {
        console.error('Unable to restore YouTube player bandwidth:', error);
    }
};

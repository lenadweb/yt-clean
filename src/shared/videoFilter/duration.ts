export type DurationFilterSetting = {
    enabled: boolean;
    min: number;
    max: number | null;
};

export const DURATION_STOPS: Array<number | null> = [
    0,
    1,
    2,
    3,
    5,
    10,
    15,
    20,
    30,
    45,
    60,
    90,
    120,
    null,
];

export const DEFAULT_DURATION_FILTER: DurationFilterSetting = {
    enabled: true,
    min: 0,
    max: null,
};

const DURATION_REGEXP = /^(?:(\d+):)?(\d{1,2}):(\d{2})$/;

export const parseDuration = (text: string): number | null => {
    const match = DURATION_REGEXP.exec(text.trim());
    if (!match) return null;

    const [, hours = '0', minutes, seconds] = match;
    return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
};

export const isDurationFilterActive = ({
    enabled,
    min,
    max,
}: DurationFilterSetting): boolean => enabled && (min > 0 || max !== null);

export const isDurationOutOfRange = (
    seconds: number,
    { min, max }: DurationFilterSetting
): boolean => seconds < min * 60 || (max !== null && seconds > max * 60);

export const getStopIndex = (minutes: number | null): number => {
    if (minutes === null) return DURATION_STOPS.length - 1;

    const index = DURATION_STOPS.findIndex(
        (stop) => stop === null || stop >= minutes
    );
    return index === -1 ? DURATION_STOPS.length - 1 : index;
};

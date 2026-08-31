export const ENHANCED_BITRATE_EVENT = 'cln-yt-cust-enhanced-bitrate';

export interface YouTubeQualityData {
    quality?: unknown;
    formatId?: unknown;
    paygatedQualityDetails?: unknown;
}

export interface EnhancedBitrateFormat {
    quality: string;
    formatId: string | number;
}

const QUALITY_RANK = [
    'highres',
    'hd2880',
    'hd2160',
    'hd1440',
    'hd1080',
    'hd720',
    'large',
    'medium',
    'small',
    'tiny',
] as const;

const getQualityRank = (quality: string): number => {
    const rank = QUALITY_RANK.indexOf(quality as (typeof QUALITY_RANK)[number]);
    return rank === -1 ? QUALITY_RANK.length : rank;
};

export const selectEnhancedBitrateFormat = (
    qualityData: unknown
): EnhancedBitrateFormat | null => {
    if (!Array.isArray(qualityData)) return null;

    const candidates = qualityData.flatMap((item: YouTubeQualityData) => {
        if (
            !item ||
            !item.paygatedQualityDetails ||
            typeof item.quality !== 'string' ||
            (typeof item.formatId !== 'string' &&
                typeof item.formatId !== 'number')
        ) {
            return [];
        }

        return [
            {
                quality: item.quality,
                formatId: item.formatId,
            },
        ];
    });

    candidates.sort(
        (left, right) =>
            getQualityRank(left.quality) - getQualityRank(right.quality)
    );

    return candidates[0] ?? null;
};

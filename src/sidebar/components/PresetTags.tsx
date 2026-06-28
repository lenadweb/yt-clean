import React, { FC } from 'react';
import cn from 'classnames';
import { useStorage } from 'src/shared/hooks/useStorage';
import { storage } from 'src/shared/storage';
import { MANAGED_FEATURE_IDS, PRESET_IDS, PresetId } from 'src/shared/presets';
import { getFeatureSetting } from 'src/shared/storage/config';
import { I18nKey } from 'src/shared/types/config';
import { t } from 'src/shared/utils/i18n';

type PresetMeta = {
    title: I18nKey;
    description: I18nKey;
    level: number; // 0 = custom (sliders icon), 1..3 = cleanliness level
};

const PRESET_META: Record<PresetId, PresetMeta> = {
    light: {
        title: 'preset_light',
        description: 'preset_light_desc',
        level: 1,
    },
    balanced: {
        title: 'preset_balanced',
        description: 'preset_balanced_desc',
        level: 2,
    },
    maximum: {
        title: 'preset_maximum',
        description: 'preset_maximum_desc',
        level: 3,
    },
    custom: {
        title: 'preset_custom',
        description: 'preset_custom_desc',
        level: 0,
    },
};

const SlidersIcon: FC = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
            d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M20 18h0M16 18h0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
        <circle cx="16" cy="6" r="2" fill="currentColor" />
        <circle cx="8" cy="12" r="2" fill="currentColor" />
        <circle cx="14" cy="18" r="2" fill="currentColor" />
    </svg>
);

const LevelDots: FC<{ level: number; active: boolean }> = ({
    level,
    active,
}) => (
    <span className="flex items-end gap-0.5">
        {[1, 2, 3].map((step) => (
            <span
                key={step}
                className={cn(
                    'w-1 rounded-full transition-colors',
                    step === 1 && 'h-2',
                    step === 2 && 'h-3',
                    step === 3 && 'h-4',
                    step <= level
                        ? active
                            ? 'bg-white'
                            : 'bg-red-accent'
                        : active
                          ? 'bg-white/30'
                          : 'bg-black-500'
                )}
            />
        ))}
    </span>
);

const PresetTags: FC = () => {
    const [settings] = useStorage();
    const active = settings.activePreset;
    const enabled = settings.isEnabled;

    const activeCount = MANAGED_FEATURE_IDS.filter(
        (id) => getFeatureSetting(settings, id)?.enabled
    ).length;

    return (
        <div className="mb-4 rounded-2xl bg-black-700 p-3">
            <div className="mb-2.5 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-black-400">
                    {t('presets')}
                </span>
                <span className="text-xs text-black-400">
                    {t('features_hidden').replace(
                        '{count}',
                        String(activeCount)
                    )}
                </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
                {PRESET_IDS.map((preset) => {
                    const meta = PRESET_META[preset];
                    const isActive = active === preset;

                    return (
                        <button
                            key={preset}
                            disabled={!enabled}
                            onClick={() => storage.applyPreset(preset)}
                            className={cn(
                                'flex flex-col items-center gap-1.5 rounded-xl border px-1 py-2 transition-colors',
                                enabled ? 'cursor-pointer' : 'cursor-default',
                                isActive
                                    ? 'border-red-accent bg-red-accent text-white'
                                    : 'border-transparent bg-black-600 text-black-200 hover:bg-black-500'
                            )}
                        >
                            <span className="flex h-4 items-center">
                                {meta.level === 0 ? (
                                    <SlidersIcon />
                                ) : (
                                    <LevelDots
                                        level={meta.level}
                                        active={isActive}
                                    />
                                )}
                            </span>
                            <span className="text-[11px] font-medium leading-none">
                                {t(meta.title)}
                            </span>
                        </button>
                    );
                })}
            </div>

            <p className="mt-2.5 text-xs leading-snug text-black-200">
                {t(PRESET_META[active].description)}
            </p>
        </div>
    );
};

export default PresetTags;

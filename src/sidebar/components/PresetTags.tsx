import React, { FC } from 'react';
import cn from 'classnames';
import { useStorage } from 'src/shared/hooks/useStorage';
import { storage } from 'src/shared/storage';
import { PRESET_IDS, PresetId } from 'src/shared/presets';
import { I18nKey } from 'src/shared/types/config';
import { t } from 'src/shared/utils/i18n';

const PRESET_TITLES: Record<PresetId, I18nKey> = {
    balanced: 'preset_balanced',
    maximum: 'preset_maximum',
    custom: 'preset_custom',
};

const PresetTags: FC = () => {
    const [settings] = useStorage();
    const active = settings.activePreset;
    const enabled = settings.isEnabled;

    return (
        <div className="mb-4 flex flex-wrap gap-2">
            {PRESET_IDS.map((preset) => (
                <button
                    key={preset}
                    disabled={!enabled}
                    onClick={() => storage.applyPreset(preset)}
                    className={cn(
                        'rounded-full px-3 py-1.5 text-sm transition-colors',
                        enabled ? 'cursor-pointer' : 'cursor-default',
                        active === preset
                            ? 'bg-red-accent text-white'
                            : 'bg-black-700 text-black-200 hover:bg-black-600'
                    )}
                >
                    {t(PRESET_TITLES[preset])}
                </button>
            ))}
        </div>
    );
};

export default PresetTags;

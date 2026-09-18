import React, { FC, useState } from 'react';
import cn from 'classnames';
import { useStorage, useStorageValue } from 'src/shared/hooks/useStorage';
import { DURATION_STOPS, getStopIndex } from 'src/shared/videoFilter/duration';
import FilterGroupHeader from 'src/sidebar/components/FilterGroupHeader';
import { Range, RangeSlider } from 'src/sidebar/components/RangeSlider';
import { getUiLocale, t } from 'src/shared/utils/i18n';

const formatMinutes = (minutes: number): string => {
    const locale = getUiLocale();

    if (minutes < 60) {
        return new Intl.NumberFormat(locale, {
            style: 'unit',
            unit: 'minute',
            unitDisplay: 'short',
        }).format(minutes);
    }

    return new Intl.NumberFormat(locale, {
        style: 'unit',
        unit: 'hour',
        unitDisplay: 'short',
        maximumFractionDigits: 1,
    }).format(minutes / 60);
};

const formatStop = (index: number): string => {
    const minutes = DURATION_STOPS[index];
    return minutes === null ? t('duration_no_limit') : formatMinutes(minutes);
};

const DurationFilter: FC = () => {
    const [settings] = useStorage();
    const [filter, setFilter] = useStorageValue('durationFilter');
    const [draft, setDraft] = useState<Range | null>(null);
    const enabled = settings.isEnabled;
    const isGrey = !enabled || !filter.enabled;
    const range: Range = draft ?? [
        getStopIndex(filter.min),
        getStopIndex(filter.max),
    ];

    const commit = ([low, high]: Range) => {
        setDraft(null);
        setFilter({
            ...filter,
            min: DURATION_STOPS[low] ?? 0,
            max: DURATION_STOPS[high],
        });
    };

    return (
        <div className="last:!mb-2">
            <FilterGroupHeader
                title="hide_by_duration"
                hint="duration_filter_hint"
                enabled={filter.enabled}
                onToggle={(value) => setFilter({ ...filter, enabled: value })}
            />
            <div className="ml-3 flex flex-col gap-2.5">
                <div
                    className={cn(
                        'flex items-center justify-between text-[12px] transition-colors',
                        isGrey ? 'text-black-400' : 'text-white-100'
                    )}
                >
                    <span>{formatStop(range[0])}</span>
                    <span>{formatStop(range[1])}</span>
                </div>
                <RangeSlider
                    count={DURATION_STOPS.length}
                    value={range}
                    disabled={!enabled}
                    isGrey={isGrey}
                    labels={[t('duration_min'), t('duration_max')]}
                    getValueText={formatStop}
                    onChange={setDraft}
                    onCommit={commit}
                />
            </div>
        </div>
    );
};

export default DurationFilter;

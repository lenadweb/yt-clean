import React, { FC, useEffect, useState } from 'react';
import { PLAYBACK_OPTIONS } from 'src/shared/config/video';
import { setShortsPlaybackSpeed } from 'src/shared/utils/yt';
import { useUrl } from 'src/shared/hooks/useUrl';
import { UrlRegExps } from 'src/shared/const';
import { Slider } from 'src/content/components/Slider';

type Option = {
    label: string;
    value: string;
};

type Props = {
    label?: string;
    value: string;
    options: Option[];
    disabled?: boolean;
    onChange: (value: string) => void;
};

export const Dropdown: FC<Props> = ({
    label,
    value,
    options,
    disabled,
    onChange,
}) => (
    <div className="flex flex-col gap-1">
        {label && <label className="text-sm text-gray-700">{label}</label>}
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);

const ShortsSpeedControl: FC = () => {
    const [speed, setSpeed] = useState(1);
    const url = useUrl();

    useEffect(() => {
        if (new RegExp(UrlRegExps.Shorts).test(url)) {
            setShortsPlaybackSpeed(speed.toString());
        }
    }, [speed, url]);

    return (
        <div className="absolute -left-20 bottom-24 z-max p-4">
            <Slider
                vertical={true}
                showValue={`${speed.toFixed(1)}x`}
                min={0.3}
                step={0.1}
                max={3}
                size="120px"
                value={speed}
                onChange={setSpeed}
            />
        </div>
    );
};

export default ShortsSpeedControl;

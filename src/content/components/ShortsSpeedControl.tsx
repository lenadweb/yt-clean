import React, { FC, useState } from 'react';
import { PLAYBACK_OPTIONS } from 'src/shared/config/video';

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
    const [speed, setSpeed] = useState('1');

    return (
        <div className="absolute right-0 top-0 z-max p-4">
            <Dropdown
                label="Скорость воспроизведения"
                value={speed}
                options={PLAYBACK_OPTIONS}
                onChange={setSpeed}
            />
        </div>
    );
};

export default ShortsSpeedControl;

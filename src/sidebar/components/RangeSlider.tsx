import React, {
    FC,
    KeyboardEvent,
    PointerEvent,
    useRef,
    useState,
} from 'react';
import cn from 'classnames';

export type Range = [number, number];

type Thumb = 0 | 1;

type Props = {
    count: number;
    value: Range;
    disabled?: boolean;
    isGrey?: boolean;
    labels: [string, string];
    getValueText: (index: number) => string;
    onChange: (value: Range) => void;
    onCommit: (value: Range) => void;
};

const clamp = (value: number, min: number, max: number): number =>
    Math.min(Math.max(value, min), max);

const moveThumb = (
    [low, high]: Range,
    thumb: Thumb,
    index: number,
    count: number
): Range =>
    thumb === 0
        ? [clamp(index, 0, high - 1), high]
        : [low, clamp(index, low + 1, count - 1)];

const pickThumb = ([low, high]: Range, index: number): Thumb => {
    if (index <= low) return 0;
    if (index >= high) return 1;
    return index - low <= high - index ? 0 : 1;
};

const KEY_STEPS: Record<string, number> = {
    ArrowLeft: -1,
    ArrowDown: -1,
    ArrowRight: 1,
    ArrowUp: 1,
};

export const RangeSlider: FC<Props> = ({
    count,
    value,
    disabled,
    isGrey,
    labels,
    getValueText,
    onChange,
    onCommit,
}) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const thumbRefs = useRef<Array<HTMLDivElement | null>>([]);
    const [activeThumb, setActiveThumb] = useState<Thumb | null>(null);
    const latest = useRef<Range>(value);
    latest.current = value;

    const getPercent = (index: number): number => (index / (count - 1)) * 100;

    const getIndexAt = (clientX: number): number => {
        const rect = trackRef.current?.getBoundingClientRect();
        if (!rect || rect.width === 0) return 0;

        const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
        return Math.round(ratio * (count - 1));
    };

    const update = (thumb: Thumb, index: number): Range => {
        const next = moveThumb(latest.current, thumb, index, count);
        if (next[0] !== latest.current[0] || next[1] !== latest.current[1]) {
            latest.current = next;
            onChange(next);
        }
        return next;
    };

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        if (disabled || event.button !== 0) return;

        event.preventDefault();
        const index = getIndexAt(event.clientX);
        const thumb = pickThumb(latest.current, index);

        event.currentTarget.setPointerCapture(event.pointerId);
        setActiveThumb(thumb);
        thumbRefs.current[thumb]?.focus();
        update(thumb, index);
    };

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
        if (activeThumb === null) return;
        update(activeThumb, getIndexAt(event.clientX));
    };

    const handlePointerUp = () => {
        if (activeThumb === null) return;

        setActiveThumb(null);
        onCommit(latest.current);
    };

    const handleKeyDown =
        (thumb: Thumb) => (event: KeyboardEvent<HTMLDivElement>) => {
            if (disabled) return;

            const current = latest.current[thumb];
            const target =
                event.key === 'Home'
                    ? 0
                    : event.key === 'End'
                      ? count - 1
                      : event.key in KEY_STEPS
                        ? current + KEY_STEPS[event.key]
                        : null;

            if (target === null) return;

            event.preventDefault();
            onCommit(update(thumb, target));
        };

    const [low, high] = value;

    return (
        <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={cn(
                'relative h-5 touch-none select-none',
                disabled ? 'cursor-default' : 'cursor-pointer'
            )}
        >
            <div
                ref={trackRef}
                className="absolute inset-x-2 top-1/2 h-1 -translate-y-1/2 rounded-full bg-black-600"
            >
                <div
                    className={cn(
                        'absolute inset-y-0 rounded-full transition-colors',
                        isGrey ? 'bg-black-500' : 'bg-red-accent'
                    )}
                    style={{
                        left: `${getPercent(low)}%`,
                        right: `${100 - getPercent(high)}%`,
                    }}
                />
                {([0, 1] as Thumb[]).map((thumb) => (
                    <div
                        key={thumb}
                        ref={(element) => {
                            thumbRefs.current[thumb] = element;
                        }}
                        role="slider"
                        tabIndex={disabled ? -1 : 0}
                        aria-label={labels[thumb]}
                        aria-disabled={disabled}
                        aria-valuemin={0}
                        aria-valuemax={count - 1}
                        aria-valuenow={value[thumb]}
                        aria-valuetext={getValueText(value[thumb])}
                        onKeyDown={handleKeyDown(thumb)}
                        className={cn(
                            'absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[background-color,transform] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
                            isGrey ? 'bg-black-400' : 'bg-white-100',
                            activeThumb === thumb && 'scale-110'
                        )}
                        style={{
                            left: `${getPercent(value[thumb])}%`,
                            zIndex: activeThumb === thumb ? 2 : 1,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

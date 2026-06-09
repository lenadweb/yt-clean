import React, {
    FC,
    MutableRefObject,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import cn from 'classnames';

type SliderProps = {
    value: number;
    containerRef?: MutableRefObject<HTMLDivElement | null>;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    vertical?: boolean;
    showValue?: string;
    size?: string;
    stops?: number[];
};

type ClientPoint = {
    clientX: number;
    clientY: number;
};

type SliderAxisProps = Pick<SliderProps, 'vertical' | 'size'>;
type SliderRangeProps = Required<Pick<SliderProps, 'min' | 'max' | 'step'>>;

export const clamp = (value: number, min: number, max: number): number =>
    Math.min(Math.max(value, min), max);

export const getValuePercent = (
    value: number,
    min: number,
    max: number
): number => clamp(((value - min) / (max - min)) * 100, 0, 100);

const getStopPercent = (stop: number, min: number, max: number): number =>
    ((stop - min) / (max - min)) * 100;

export const getSteppedValue = (
    percent: number,
    min: number,
    max: number,
    step: number
): number => Math.round((percent * (max - min)) / step) * step + min;

const getEventPercent = (
    event: ClientPoint,
    rect: DOMRect,
    vertical: boolean
): number => {
    if (vertical) {
        return clamp(1 - (event.clientY - rect.top) / rect.height, 0, 1);
    }

    return clamp((event.clientX - rect.left) / rect.width, 0, 1);
};

const stopIsActive = (value: number, stop: number): boolean =>
    value.toFixed(2) === stop.toFixed(2);

const getStopStyle = (
    stop: number,
    min: number,
    max: number,
    vertical: boolean
): React.CSSProperties => {
    const stopPercent = getStopPercent(stop, min, max);

    if (vertical) {
        return {
            bottom: `calc(${stopPercent}% - 1px)`,
            left: '-4.5rem',
            transform: 'translateY(-50%)',
        };
    }

    return {
        left: `${stopPercent}%`,
        top: '-1.5rem',
        transform: 'translateX(-50%)',
    };
};

const getFillStyle = (
    percent: number,
    vertical: boolean
): React.CSSProperties =>
    vertical ? { height: `${percent}%` } : { width: `${percent}%` };

const getThumbStyle = (
    percent: number,
    vertical: boolean
): React.CSSProperties =>
    vertical
        ? {
              bottom: `${percent}%`,
              height: '20px',
              width: '20px',
          }
        : {
              left: `${percent}%`,
              height: '20px',
              width: '20px',
          };

const useSliderDrag = (
    trackRef: MutableRefObject<HTMLDivElement | null>,
    { min, max, step }: SliderRangeProps,
    vertical: boolean,
    onChange: (value: number) => void
) => {
    const [isDragging, setIsDragging] = useState(false);

    const updateValue = useCallback(
        (event: ClientPoint) => {
            const rect = trackRef.current?.getBoundingClientRect();
            if (!rect) return;

            const percent = getEventPercent(event, rect, vertical);
            onChange(getSteppedValue(percent, min, max, step));
        },
        [max, min, onChange, step, trackRef, vertical]
    );

    const handleMouseMove = useCallback(
        (event: MouseEvent) => {
            if (!isDragging) return;
            updateValue(event);
        },
        [isDragging, updateValue]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (!isDragging) return;

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault();
            setIsDragging(true);
            updateValue(event);
        },
        [updateValue]
    );
};

const SliderStops: FC<
    Pick<SliderProps, 'stops' | 'value' | 'onChange'> &
        SliderAxisProps &
        Pick<SliderRangeProps, 'min' | 'max'>
> = ({ stops = [], value, onChange, min, max, vertical = false, size }) => (
    <div className="relative top-5" style={{ height: size }}>
        {stops.map((stop) => (
            <button
                key={stop}
                onClick={() => onChange(stop)}
                className={cn(
                    'absolute z-20 min-w-9 rounded-full px-1 py-0.5 text-[12px] text-white transition hover:bg-yt-red',
                    stopIsActive(value, stop)
                        ? 'bg-yt-red'
                        : 'bg-yt-grey-button-bg'
                )}
                style={getStopStyle(stop, min, max, vertical)}
            >
                {stop}x
            </button>
        ))}
    </div>
);

const SliderTrack: FC<
    {
        percent: number;
        trackRef: MutableRefObject<HTMLDivElement | null>;
        onMouseDown: (event: React.MouseEvent) => void;
    } & SliderAxisProps
> = ({ percent, trackRef, vertical = false, size, onMouseDown }) => (
    <div
        ref={trackRef}
        onMouseDown={onMouseDown}
        className={cn(
            'relative cursor-pointer select-none rounded-full bg-yt-light-dark',
            vertical ? 'w-2' : 'h-2'
        )}
        style={vertical ? { height: size } : { width: size }}
    >
        <div
            className={cn(
                'absolute bg-white',
                vertical
                    ? 'bottom-0 left-0 w-full rounded-full'
                    : 'left-0 top-0 h-full rounded-full'
            )}
            style={getFillStyle(percent, vertical)}
        />

        <div
            className={cn(
                'absolute z-10 rounded-full bg-white shadow-md',
                vertical
                    ? 'left-1/2 -translate-x-1/2 translate-y-1/2'
                    : 'top-1/2 -translate-y-1/2'
            )}
            style={getThumbStyle(percent, vertical)}
        />
    </div>
);

const SliderValue: FC<{ value: string }> = ({ value }) =>
    value ? (
        <span className="absolute -top-7 left-0 flex min-w-full items-center justify-center text-right text-xs text-white">
            {value}
        </span>
    ) : null;

export const Slider: FC<SliderProps> = ({
    containerRef,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    vertical = false,
    showValue = '',
    size = '160px',
    stops = [],
}) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const handleMouseDown = useSliderDrag(
        trackRef,
        { min, max, step },
        vertical,
        onChange
    );
    const percent = getValuePercent(value, min, max);

    return (
        <div
            ref={containerRef}
            className={cn(
                'relative flex items-center',
                vertical ? 'flex-row' : 'flex-col'
            )}
        >
            <SliderStops
                stops={stops}
                value={value}
                onChange={onChange}
                min={min}
                max={max}
                vertical={vertical}
                size={size}
            />

            <div
                className={cn(
                    'flex gap-2 rounded-full bg-yt-grey-button-bg p-5 transition-colors hover:bg-yt-grey-button-bg-hover',
                    vertical
                        ? 'flex-col-reverse items-center'
                        : 'flex-row items-center'
                )}
            >
                <SliderTrack
                    percent={percent}
                    trackRef={trackRef}
                    vertical={vertical}
                    size={size}
                    onMouseDown={handleMouseDown}
                />
            </div>

            <SliderValue value={showValue} />
        </div>
    );
};

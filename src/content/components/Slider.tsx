import React, {
    FC,
    MutableRefObject,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

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

const clamp = (value: number, min: number, max: number): number =>
    Math.min(Math.max(value, min), max);

const roundToStep = (
    percent: number,
    min: number,
    max: number,
    step: number
): number => Math.round((percent * (max - min)) / step) * step + min;

export const Slider: FC<SliderProps> = ({
    containerRef,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    vertical = false,
    showValue = '',
    size = vertical ? '160px' : '160px',
    stops = [],
}) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const getPercentFromEvent = useCallback(
        (e: MouseEvent | React.MouseEvent) => {
            const rect = trackRef.current?.getBoundingClientRect();
            if (!rect) return 0;

            if (vertical) {
                const offsetY = e.clientY - rect.top;
                return clamp(1 - offsetY / rect.height, 0, 1);
            }

            const offsetX = e.clientX - rect.left;
            return clamp(offsetX / rect.width, 0, 1);
        },
        [vertical]
    );

    const updateValueFromEvent = useCallback(
        (e: MouseEvent | React.MouseEvent) => {
            const percent = getPercentFromEvent(e);
            onChange(roundToStep(percent, min, max, step));
        },
        [getPercentFromEvent, max, min, onChange, step]
    );

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        updateValueFromEvent(e);
    };

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging) return;
            updateValueFromEvent(e);
        },
        [isDragging, updateValueFromEvent]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const percent = ((value - min) / (max - min)) * 100;

    return (
        <div
            ref={containerRef}
            className={`relative flex ${
                vertical ? 'flex-row' : 'flex-col'
            } items-center`}
        >
            <div className="relative top-5" style={{ height: size }}>
                {stops.map((stop, i) => {
                    const stopPercent = ((stop - min) / (max - min)) * 100;
                    return (
                        <button
                            key={i}
                            onClick={() => onChange(stop)}
                            className={`absolute z-20 min-w-9 text-[12px] text-white transition hover:bg-yt-red  ${
                                value?.toFixed(2) === stop.toFixed(2)
                                    ? 'bg-yt-red'
                                    : 'bg-yt-grey-button-bg'
                            } rounded-full px-1 py-0.5`}
                            style={
                                vertical
                                    ? {
                                          bottom: `calc(${stopPercent}% - 1px)`,
                                          left: '-4.5rem',
                                          transform: 'translateY(-50%)',
                                      }
                                    : {
                                          left: `${stopPercent}%`,
                                          top: '-1.5rem',
                                          transform: 'translateX(-50%)',
                                      }
                            }
                        >
                            {stop}x
                        </button>
                    );
                })}
            </div>

            <div
                className={`flex rounded-full bg-yt-grey-button-bg p-5 transition-colors hover:bg-yt-grey-button-bg-hover ${
                    vertical
                        ? 'flex-col-reverse items-center'
                        : 'flex-row items-center'
                } gap-2`}
            >
                <div
                    ref={trackRef}
                    onMouseDown={handleMouseDown}
                    className={`relative ${
                        vertical ? 'w-2' : 'h-2'
                    } cursor-pointer select-none rounded-full bg-yt-light-dark`}
                    style={vertical ? { height: size } : { width: size }}
                >
                    <div
                        className={`absolute ${
                            vertical
                                ? 'bottom-0 left-0 w-full rounded-full bg-white'
                                : 'left-0 top-0 h-full rounded-full bg-white'
                        }`}
                        style={
                            vertical
                                ? { height: `${percent}%` }
                                : { width: `${percent}%` }
                        }
                    />

                    <div
                        className={`absolute z-10 ${
                            vertical
                                ? 'left-1/2 -translate-x-1/2 translate-y-1/2'
                                : 'top-1/2 -translate-y-1/2'
                        } rounded-full bg-white shadow-md`}
                        style={
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
                                  }
                        }
                    />
                </div>
            </div>

            {showValue && (
                <span className="absolute -top-7 left-0 flex min-w-full items-center justify-center text-right text-xs text-white">
                    {showValue}
                </span>
            )}
        </div>
    );
};

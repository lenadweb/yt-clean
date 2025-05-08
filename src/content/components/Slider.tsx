import React, { FC, useCallback, useRef, useState, useEffect } from 'react';

type SliderProps = {
    value: number;
    _ref?: any;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    vertical?: boolean;
    showValue?: string;
    size?: string;
};

export const Slider: FC<SliderProps> = ({
    _ref,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    vertical = false,
    showValue = '',
    size = vertical ? '160px' : '160px',
}) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const getPercentFromEvent = (e: MouseEvent | React.MouseEvent) => {
        const rect = trackRef.current?.getBoundingClientRect();
        if (!rect) return 0;

        let percent: number;

        if (vertical) {
            const offsetY = e.clientY - rect.top;
            percent = 1 - offsetY / rect.height;
        } else {
            const offsetX = e.clientX - rect.left;
            percent = offsetX / rect.width;
        }

        return Math.min(Math.max(percent, 0), 1);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        const percent = getPercentFromEvent(e);
        const newValue =
            Math.round((percent * (max - min)) / step) * step + min;
        onChange(newValue);
    };

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging) return;
            const percent = getPercentFromEvent(e);
            const newValue =
                Math.round((percent * (max - min)) / step) * step + min;
            onChange(newValue);
        },
        [isDragging, max, min, step, onChange, vertical]
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
        <div ref={_ref} className="relative">
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

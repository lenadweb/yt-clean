import React, { FC, useCallback, useRef, useState } from 'react';
import { Slider } from 'src/content/components/Slider';
import { useStorageValue } from 'src/shared/hooks/useStorage';
import { useOutsideClick } from 'src/shared/hooks/useOutsideClick';

const PlaybackSpeed: FC = () => {
    const [sliderIsOpen, setSliderIsOpen] = useState(false);
    const refContainer = useRef(null);
    const refSlider = useRef(null);

    useOutsideClick([refContainer, refSlider], () => {
        if (sliderIsOpen) {
            setSliderIsOpen(false);
        }
    });

    const [persistentPlaybackSpeed, setPersistentPlaybackSpeed] =
        useStorageValue('persistentPlaybackSpeed');

    const onChange = (value: number) => {
        setPersistentPlaybackSpeed({
            ...persistentPlaybackSpeed,
            value: value.toString(),
        });
    };

    const toggleSlider = useCallback(() => {
        setSliderIsOpen((prev) => !prev);
    }, []);

    return (
        <div
            ref={refContainer}
            className="relative -top-5 flex size-12 items-center justify-center"
        >
            <div onClick={toggleSlider} className="font-semibold">
                {Number(persistentPlaybackSpeed.value).toFixed(2)}x
            </div>
            {sliderIsOpen && (
                <div className="absolute -top-44 ">
                    <Slider
                        _ref={refSlider}
                        vertical={true}
                        min={0.3}
                        step={0.1}
                        max={3}
                        size="120px"
                        value={Number(persistentPlaybackSpeed.value || '1')}
                        onChange={onChange}
                    />
                </div>
            )}
        </div>
    );
};

export default PlaybackSpeed;

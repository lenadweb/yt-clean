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

    const [speedControl, setSpeedControl] = useStorageValue('speedControl');

    const onChange = (value: number) => {
        setSpeedControl({
            ...speedControl,
            value: value.toString(),
        });
    };

    const toggleSlider = useCallback(() => {
        setSliderIsOpen((prev) => !prev);
    }, []);

    return (
        <div
            ref={refContainer}
            className="relative top-1.5 flex size-12 items-center justify-center"
        >
            <div onClick={toggleSlider} className="font-semibold">
                {parseFloat(Number(speedControl.value).toFixed(2))}x
            </div>
            {sliderIsOpen && (
                <div className="absolute -top-[210px]">
                    <Slider
                        stops={[1, 1.5, 2]}
                        _ref={refSlider}
                        vertical={true}
                        min={0.3}
                        step={0.05}
                        max={2.5}
                        size="150px"
                        value={Number(speedControl.value || '1')}
                        onChange={onChange}
                    />
                </div>
            )}
        </div>
    );
};

export default PlaybackSpeed;

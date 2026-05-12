import React, { FC, useEffect, useState } from 'react';
import { setShortsPlaybackSpeed } from 'src/shared/utils/yt';
import { useUrl } from 'src/shared/hooks/useUrl';
import { UrlRegExps } from 'src/shared/const';
import { Slider } from 'src/content/components/Slider';

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

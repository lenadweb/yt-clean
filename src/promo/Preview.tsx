import React, { FC, useState } from 'react';
import { PromoScene, SCENES } from 'src/promo/scenes';

const ZOOMS = [0.4, 0.55, 0.7, 1];

type StageProps = {
    scene: PromoScene;
    zoom: number;
};

const Stage: FC<StageProps> = ({ scene, zoom }) => (
    <div className="preview__item">
        <div className="preview__caption">
            <span className="preview__caption-title">{scene.title}</span>
            <span className="preview__caption-meta">
                {scene.width} × {scene.height} · store/assets/{scene.file}
            </span>
        </div>
        <div
            className="preview__frame"
            style={{
                width: scene.width * zoom,
                height: scene.height * zoom,
            }}
        >
            <div
                className="promo-scene"
                style={{
                    width: scene.width,
                    height: scene.height,
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top left',
                }}
            >
                <scene.Component />
            </div>
        </div>
    </div>
);

const Preview = () => {
    const [zoom, setZoom] = useState(0.55);
    const [only, setOnly] = useState<string>('all');

    const scenes =
        only === 'all' ? SCENES : SCENES.filter((scene) => scene.id === only);

    return (
        <div className="preview">
            <div className="preview__bar">
                <span className="preview__logo">YouTube Clean · promo</span>

                <div className="preview__group">
                    <button
                        className={only === 'all' ? 'is-active' : undefined}
                        onClick={() => setOnly('all')}
                    >
                        All
                    </button>
                    {SCENES.map((scene) => (
                        <button
                            key={scene.id}
                            className={
                                only === scene.id ? 'is-active' : undefined
                            }
                            onClick={() => setOnly(scene.id)}
                        >
                            {scene.title}
                        </button>
                    ))}
                </div>

                <div className="preview__group preview__group--right">
                    {ZOOMS.map((value) => (
                        <button
                            key={value}
                            className={zoom === value ? 'is-active' : undefined}
                            onClick={() => setZoom(value)}
                        >
                            {Math.round(value * 100)}%
                        </button>
                    ))}
                </div>
            </div>

            <div className="preview__list">
                {scenes.map((scene) => (
                    <Stage key={scene.id} scene={scene} zoom={zoom} />
                ))}
            </div>
        </div>
    );
};

export default Preview;

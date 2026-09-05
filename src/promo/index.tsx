import React from 'react';
import { createRoot } from 'react-dom/client';
import Preview from 'src/promo/Preview';
import { getScene } from 'src/promo/scenes';
import '@assets/styles/index.css';
import 'src/promo/styles/base.css';
import 'src/promo/styles/panel.css';
import 'src/promo/styles/hero.css';
import 'src/promo/styles/youtube-mock.css';
import 'src/promo/styles/before-after.css';
import 'src/promo/styles/power.css';
import 'src/promo/styles/fresh.css';
import 'src/promo/styles/feature-compare.css';
import 'src/promo/styles/tile.css';
import 'src/promo/styles/preview.css';

const requested = new URLSearchParams(window.location.search).get('scene');
const scene = getScene(requested);
const root = createRoot(document.getElementById('root')!);

if (scene) {
    document.documentElement.classList.add('is-capture');
    document.documentElement.style.width = `${scene.width}px`;
    document.documentElement.style.height = `${scene.height}px`;

    root.render(
        <div
            className="promo-scene"
            style={{ width: scene.width, height: scene.height }}
        >
            <scene.Component />
        </div>
    );
} else {
    root.render(<Preview />);
}

import { FC } from 'react';
import definitions from 'src/promo/scenes.json';
import HeroScene from 'src/promo/scenes/HeroScene';
import BeforeAfterScene from 'src/promo/scenes/BeforeAfterScene';
import PowerScene from 'src/promo/scenes/PowerScene';
import PowerWideScene from 'src/promo/scenes/PowerWideScene';
import FreshScene from 'src/promo/scenes/FreshScene';
import FocusScene from 'src/promo/scenes/FocusScene';
import NavigationScene from 'src/promo/scenes/NavigationScene';
import TileScene from 'src/promo/scenes/TileScene';

export type PromoScene = {
    id: string;
    file: string;
    title: string;
    width: number;
    height: number;
    Component: FC;
};

const COMPONENTS: Record<string, FC> = {
    hero: HeroScene,
    'before-after': BeforeAfterScene,
    power: PowerScene,
    'power-wide': PowerWideScene,
    fresh: FreshScene,
    focus: FocusScene,
    navigation: NavigationScene,
    tile: TileScene,
};

const missingComponents = definitions
    .filter((definition) => !COMPONENTS[definition.id])
    .map((definition) => definition.id);

if (missingComponents.length) {
    throw new Error(
        `Missing promo scene component for: ${missingComponents.join(', ')}`
    );
}

export const SCENES: PromoScene[] = definitions.map((definition) => ({
    ...definition,
    Component: COMPONENTS[definition.id],
}));

export const getScene = (id: string | null) =>
    SCENES.find((scene) => scene.id === id);

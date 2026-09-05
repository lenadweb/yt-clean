import { FC } from 'react';
import definitions from 'src/promo/scenes.json';
import HeroScene from 'src/promo/scenes/HeroScene';
import BeforeAfterScene from 'src/promo/scenes/BeforeAfterScene';
import PowerScene from 'src/promo/scenes/PowerScene';
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
    tile: TileScene,
};

export const SCENES: PromoScene[] = definitions.map((definition) => ({
    ...definition,
    Component: COMPONENTS[definition.id],
}));

export const getScene = (id: string | null) =>
    SCENES.find((scene) => scene.id === id);

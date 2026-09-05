import { describe, expect, it } from 'vitest';
import definitions from 'src/promo/scenes.json';
import { getScene, SCENES } from 'src/promo/scenes/index';

describe('promo scenes', () => {
    it('registers every scene definition with a component', () => {
        expect(SCENES).toHaveLength(definitions.length);
        expect(
            SCENES.every((scene) => typeof scene.Component === 'function')
        ).toBe(true);
    });

    it('uses unique ids and output files', () => {
        expect(new Set(SCENES.map((scene) => scene.id)).size).toBe(
            SCENES.length
        );
        expect(new Set(SCENES.map((scene) => scene.file)).size).toBe(
            SCENES.length
        );
    });

    it('finds scenes by id', () => {
        expect(getScene('fresh')?.file).toBe('promo-4.png');
        expect(getScene('missing')).toBeUndefined();
    });
});

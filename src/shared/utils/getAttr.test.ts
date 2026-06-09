import { describe, expect, it } from 'vitest';
import { getAttr } from 'src/shared/utils/getAttr';
import { BASE_ATTR_PREFIX } from 'src/shared/const';

describe('getAttr', () => {
    it('prefixes the name with the shared base prefix', () => {
        expect(getAttr('hide-class')).toBe(`${BASE_ATTR_PREFIX}-hide-class`);
    });

    it('is deterministic for the same input', () => {
        expect(getAttr('feature-hide-shorts')).toBe(
            getAttr('feature-hide-shorts')
        );
    });
});

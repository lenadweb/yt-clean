import { describe, expect, it } from 'vitest';
import { styles } from 'src/shared/stylesBuilder';

describe('generated feature CSS', () => {
    it('keeps every rule behind an extension attribute, including multi-rule features', () => {
        const rules = [...styles.matchAll(/([^{}]+)\{[^{}]*\}/g)];
        expect(rules.length).toBeGreaterThan(0);
        rules.forEach(([, selector]) => {
            expect(selector.trim()).toMatch(/^\[cln-yt-cust-/);
        });
    });
});

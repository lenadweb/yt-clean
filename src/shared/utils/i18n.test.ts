import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const localesDir = path.resolve(__dirname, '../../_locales');

const readLocaleKeys = (locale: string): string[] =>
    Object.keys(
        JSON.parse(
            readFileSync(path.join(localesDir, locale, 'messages.json'), 'utf8')
        )
    ).sort();

const locales = readdirSync(localesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

describe('locales', () => {
    const enKeys = readLocaleKeys('en');

    it('finds the locale directories', () => {
        expect(locales).toContain('en');
        expect(locales.length).toBeGreaterThan(1);
    });

    it.each(locales.filter((locale) => locale !== 'en'))(
        '%s has the same keys as en',
        (locale) => {
            expect(readLocaleKeys(locale)).toEqual(enKeys);
        }
    );
});

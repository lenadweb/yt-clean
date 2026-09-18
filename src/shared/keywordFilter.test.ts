import { describe, expect, it } from 'vitest';
import {
    addKeyword,
    KEYWORD_FILTER_MAX_LENGTH,
    matchesKeywords,
    normalizeKeyword,
} from 'src/shared/keywordFilter';

describe('normalizeKeyword', () => {
    it('trims, collapses whitespace and lowercases', () => {
        expect(normalizeKeyword('  Minecraft   LET’S  Play ')).toBe(
            'minecraft let’s play'
        );
    });
});

describe('addKeyword', () => {
    it('adds a normalized keyword', () => {
        expect(addKeyword(['news'], ' Футбол ')).toEqual(['news', 'футбол']);
    });

    it('ignores empty and duplicate keywords', () => {
        expect(addKeyword(['news'], '   ')).toEqual(['news']);
        expect(addKeyword(['news'], 'NEWS')).toEqual(['news']);
    });

    it('limits keyword length', () => {
        expect(addKeyword([], 'a'.repeat(500))[0]).toHaveLength(
            KEYWORD_FILTER_MAX_LENGTH
        );
    });
});

describe('matchesKeywords', () => {
    it('matches case-insensitively by substring', () => {
        expect(
            matchesKeywords('Я СОБРАЛ АВТОГРАФЫ ЛЕГЕНД ФУТБОЛА', ['футбол'])
        ).toBe(true);
        expect(matchesKeywords('Minecraft Hardcore', ['hardcore'])).toBe(true);
    });

    it('matches phrases across irregular whitespace', () => {
        expect(matchesKeywords('Top  10\nfails', ['top 10'])).toBe(true);
    });

    it('does not match without keywords or hits', () => {
        expect(matchesKeywords('Cooking pasta', [])).toBe(false);
        expect(matchesKeywords('Cooking pasta', ['football'])).toBe(false);
    });
});

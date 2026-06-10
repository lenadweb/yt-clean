import { describe, expect, it } from 'vitest';
import { ElementActions } from 'src/shared/types/config';
import { category, feature, section } from 'src/shared/featureConfig/dsl';
import { getAttr } from 'src/shared/utils/getAttr';

const buildCategory = () =>
    category('feed_and_recommendations', [
        section('content_blocks', { hideWhenAllEnabled: ['#group'] }, [
            feature({ id: 'hideShorts', hide: ['#shorts'] }),
            feature({ id: 'hideJams', hide: ['#jams'] }),
        ]),
        section('ads', [feature({ id: 'adsFeedVideo', hide: ['#ads'] })]),
    ]);

describe('feature', () => {
    it('attaches a kebab-cased feature attribute to every action', () => {
        const result = feature({ id: 'hideShorts', hide: ['#shorts'] });

        expect(result.actions).toHaveLength(1);
        expect(result.actions[0].attr).toBe(getAttr('feature-hide-shorts'));
    });

    it('builds one action per declared field', () => {
        const result = feature({
            id: 'hideShorts',
            hide: ['#shorts'],
            styles: ['#x { color: red; }'],
            custom: true,
        });

        expect(result.actions.map((action) => action.action)).toEqual([
            ElementActions.hide,
            ElementActions.customStyles,
            ElementActions.custom,
        ]);
    });
});

describe('category', () => {
    it('keeps the declared tree of sections and features', () => {
        const result = buildCategory();

        expect(result.title).toBe('feed_and_recommendations');
        expect(result.sections.map((s) => s.title)).toEqual([
            'content_blocks',
            'ads',
        ]);
        expect(result.sections[0].features).toHaveLength(2);
        expect(result.sections[1].features).toHaveLength(1);
    });

    it('attaches a section attribute to hideWhenAllEnabled actions', () => {
        const result = buildCategory();

        expect(result.sections[0].onFullGroupEnabledActions?.[0].attr).toBe(
            getAttr('section-feed-and-recommendations-content-blocks')
        );
        expect(result.sections[1].onFullGroupEnabledActions).toBeUndefined();
    });
});

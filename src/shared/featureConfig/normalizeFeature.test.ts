import { describe, expect, it } from 'vitest';
import { IFeatureDraft } from 'src/shared/types/config';
import { hideAction } from 'src/shared/featureConfig/helpers';
import { normalizeFeature } from 'src/shared/featureConfig/normalizeFeature';
import { getAttr } from 'src/shared/utils/getAttr';

const draft: IFeatureDraft = {
    categoryKey: 'feed_and_recommendations',
    sectionKey: 'content_blocks',
    id: 'hideShorts',
    actions: [hideAction(['#shorts'])],
    ui: {
        onFullGroupEnabledActions: [hideAction(['#group'])],
    },
};

describe('normalizeFeature', () => {
    it('attaches a kebab-cased feature attribute to every action', () => {
        const normalized = normalizeFeature(draft);

        expect(normalized.actions).toHaveLength(1);
        expect(normalized.actions[0].attr).toBe(getAttr('feature-hide-shorts'));
    });

    it('attaches a section attribute to full-group actions', () => {
        const normalized = normalizeFeature(draft);

        expect(normalized.ui?.onFullGroupEnabledActions?.[0].attr).toBe(
            getAttr('section-feed-and-recommendations-content-blocks')
        );
    });
});

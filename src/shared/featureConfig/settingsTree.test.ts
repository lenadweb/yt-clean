import { describe, expect, it } from 'vitest';
import { IFeatureDraft } from 'src/shared/types/config';
import { hideAction } from 'src/shared/featureConfig/helpers';
import { normalizeFeatures } from 'src/shared/featureConfig/normalizeFeature';
import { buildSettingsCategories } from 'src/shared/featureConfig/settingsTree';

const draft = (sectionKey: string, id: IFeatureDraft['id']): IFeatureDraft => ({
    categoryKey: 'feed_and_recommendations',
    sectionKey,
    id,
    actions: [hideAction(['#x'])],
});

describe('buildSettingsCategories', () => {
    it('groups features by category and section', () => {
        const features = normalizeFeatures([
            draft('content_blocks', 'hideShorts'),
            draft('content_blocks', 'hideJams'),
            draft('ads', 'adsFeedVideo'),
        ]);

        const categories = buildSettingsCategories(features);

        expect(categories).toHaveLength(1);
        expect(categories[0].titleKey).toBe('feed_and_recommendations');

        const sections = categories[0].settings;
        expect(sections.map((s) => s.titleKey)).toEqual([
            'content_blocks',
            'ads',
        ]);
        expect(sections[0].groups).toHaveLength(2);
        expect(sections[1].groups).toHaveLength(1);
    });
});

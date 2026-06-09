import { describe, expect, it } from 'vitest';
import { FeatureDraft } from 'src/shared/types/config';
import { hideAction } from 'src/shared/featureConfig/helpers';
import { normalizeFeatures } from 'src/shared/featureConfig/normalizeFeature';
import { buildSettingsCategories } from 'src/shared/featureConfig/settingsTree';

const draft = (section: string, id: FeatureDraft['id']): FeatureDraft => ({
    category: 'feed_and_recommendations',
    section,
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
        expect(categories[0].title).toBe('feed_and_recommendations');

        const sections = categories[0].settings;
        expect(sections.map((s) => s.title)).toEqual(['content_blocks', 'ads']);
        expect(sections[0].groups).toHaveLength(2);
        expect(sections[1].groups).toHaveLength(1);
    });
});

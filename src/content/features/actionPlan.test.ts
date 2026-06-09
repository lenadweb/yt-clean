import { describe, expect, it } from 'vitest';
import { IFeatureDraft } from 'src/shared/types/config';
import { hideAction } from 'src/shared/featureConfig/helpers';
import { normalizeFeatures } from 'src/shared/featureConfig/normalizeFeature';
import { DEFAULT_STORAGE, IStorage } from 'src/shared/storage/config';
import { buildFeatureActionPlans } from 'src/content/features/actionPlan';

const draft: IFeatureDraft = {
    category: 'feed_and_recommendations',
    section: 'content_blocks',
    id: 'hideShorts',
    actions: [hideAction(['#shorts'])],
};

const features = normalizeFeatures([draft]);

const settings = (overrides: Partial<IStorage> = {}): IStorage => ({
    ...DEFAULT_STORAGE,
    isEnabled: true,
    ...overrides,
});

describe('buildFeatureActionPlans', () => {
    it('marks a feature enabled when the master toggle and feature are on', () => {
        const plans = buildFeatureActionPlans(
            features,
            settings({ hideShorts: { enabled: true } })
        );

        const plan = plans.find((p) => p.feature?.id === 'hideShorts');
        expect(plan?.status.enabled).toBe(true);
    });

    it('treats a feature as disabled when the master toggle is off', () => {
        const plans = buildFeatureActionPlans(
            features,
            settings({ isEnabled: false, hideShorts: { enabled: true } })
        );

        const plan = plans.find((p) => p.feature?.id === 'hideShorts');
        expect(plan?.status.enabled).toBe(false);
    });

    it('skips features unrelated to the change set', () => {
        const plans = buildFeatureActionPlans(
            features,
            settings({ hideShorts: { enabled: true } }),
            { hideJams: { oldValue: {}, newValue: { enabled: true } } }
        );

        expect(
            plans.find((p) => p.feature?.id === 'hideShorts')
        ).toBeUndefined();
    });
});

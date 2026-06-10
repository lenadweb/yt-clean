import { describe, expect, it } from 'vitest';
import { category, feature, section } from 'src/shared/featureConfig/dsl';
import { DEFAULT_STORAGE, StorageState } from 'src/shared/storage/config';
import { buildFeatureActionPlans } from 'src/content/features/actionPlan';

const { sections } = category('feed_and_recommendations', [
    section('content_blocks', [
        feature({ id: 'hideShorts', hide: ['#shorts'] }),
    ]),
]);

const settings = (overrides: Partial<StorageState> = {}): StorageState => ({
    ...DEFAULT_STORAGE,
    isEnabled: true,
    ...overrides,
});

describe('buildFeatureActionPlans', () => {
    it('marks a feature enabled when the master toggle and feature are on', () => {
        const plans = buildFeatureActionPlans(
            sections,
            settings({ hideShorts: { enabled: true } })
        );

        const plan = plans.find((p) => p.feature?.id === 'hideShorts');
        expect(plan?.status.enabled).toBe(true);
    });

    it('treats a feature as disabled when the master toggle is off', () => {
        const plans = buildFeatureActionPlans(
            sections,
            settings({ isEnabled: false, hideShorts: { enabled: true } })
        );

        const plan = plans.find((p) => p.feature?.id === 'hideShorts');
        expect(plan?.status.enabled).toBe(false);
    });

    it('skips features unrelated to the change set', () => {
        const plans = buildFeatureActionPlans(
            sections,
            settings({ hideShorts: { enabled: true } }),
            { hideJams: { oldValue: {}, newValue: { enabled: true } } }
        );

        expect(
            plans.find((p) => p.feature?.id === 'hideShorts')
        ).toBeUndefined();
    });
});

import { SECTIONS } from 'src/shared/featureConfig';
import { StorageState } from 'src/shared/storage/config';
import { buildFeatureActionPlans } from 'src/content/features/actionPlan';
import { FeatureAction } from 'src/shared/types/config';

const matchesUrl = (action: FeatureAction, url: string): boolean =>
    !action.urlRegExp || action.urlRegExp.some((regexp) => regexp.test(url));

export const computeActiveAttributes = (
    settings: StorageState,
    url: string
): string[] => {
    const attributes = new Set<string>();

    buildFeatureActionPlans(SECTIONS, settings).forEach((plan) => {
        if (!plan.status.enabled) return;

        plan.actions.forEach((action) => {
            if (matchesUrl(action, url)) {
                attributes.add(action.attr);
            }
        });
    });

    return Array.from(attributes);
};

export const applyAttributes = (attributes: string[]): void => {
    const root = document.documentElement;
    attributes.forEach((attr) => root.setAttribute(attr, 'true'));
};

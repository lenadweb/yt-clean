import {
    ElementActions,
    FeatureAction,
    CustomAction,
    CachedElement,
} from 'src/shared/types/config';
import { FeatureActionPlan } from 'src/content/features/types';

const isTargetUrl = (action: FeatureAction, url: string): boolean =>
    action.urlRegExp
        ? action.urlRegExp.some((regexp) => regexp.test(url))
        : true;

const setBodyAttribute = (action: FeatureAction, enabled: boolean): void => {
    if (!action.attr) return;

    if (enabled) {
        document.body?.setAttribute(action.attr, 'true');
        return;
    }

    document.body?.removeAttribute(action.attr);
};

export class DomActionExecutor {
    private readonly elementCache = new Map<string, CachedElement[]>();

    run(plan: FeatureActionPlan, url: string): void {
        plan.actions.forEach((action) => {
            this.runAction(action, plan.status.enabled, url);
        });

        this.notifyGroupChange(plan);
    }

    private runAction(
        action: FeatureAction,
        featureEnabled: boolean,
        url: string
    ): void {
        const shouldEnable = featureEnabled && isTargetUrl(action, url);

        setBodyAttribute(action, shouldEnable);

        if (action.action === ElementActions.custom) {
            this.runCustomAction(action, shouldEnable);
        }
    }

    private runCustomAction(action: CustomAction, shouldEnable: boolean): void {
        if (shouldEnable && action.onEnable) {
            Promise.resolve(action.onEnable()).then((result) => {
                if (result && action.attr) {
                    this.elementCache.set(action.attr, result);
                }
            });
            return;
        }

        if (!shouldEnable && action.onDisable) {
            action.onDisable(this.elementCache.get(action.attr));
        }
    }

    private notifyGroupChange(plan: FeatureActionPlan): void {
        const { feature, status } = plan;

        if (feature?.onChange) {
            feature.onChange(status.enabled ? status.value : 'disabled');
        }
    }
}

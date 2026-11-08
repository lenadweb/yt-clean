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

const setRootAttribute = (action: FeatureAction, enabled: boolean): void => {
    if (!action.attr) return;

    if (enabled) {
        document.documentElement.setAttribute(action.attr, 'true');
        return;
    }

    document.documentElement.removeAttribute(action.attr);
};

type RunningAction = {
    controller: AbortController;
    url: string;
    elements?: CachedElement[];
};

export class DomActionExecutor {
    private readonly runningActions = new Map<string, RunningAction>();

    run(plan: FeatureActionPlan, url: string): void {
        plan.actions.forEach((action) => {
            this.runAction(action, plan.status.enabled, url);
        });

        this.notifyGroupChange(plan, url);
    }

    private runAction(
        action: FeatureAction,
        featureEnabled: boolean,
        url: string
    ): void {
        const shouldEnable = featureEnabled && isTargetUrl(action, url);

        setRootAttribute(action, shouldEnable);

        if (action.action === ElementActions.custom) {
            this.runCustomAction(action, shouldEnable, url);
        }
    }

    private runCustomAction(
        action: CustomAction,
        shouldEnable: boolean,
        url: string
    ): void {
        const previous = this.runningActions.get(action.attr);
        if (shouldEnable && previous?.url === url) return;

        if (previous) {
            previous.controller.abort();
            this.runningActions.delete(action.attr);
            action.onDisable?.(previous.elements);
        }

        if (!shouldEnable || !action.onEnable) return;

        const running: RunningAction = {
            controller: new AbortController(),
            url,
        };
        this.runningActions.set(action.attr, running);
        void this.enableCustomAction(action, running);
    }

    private async enableCustomAction(
        action: CustomAction,
        running: RunningAction
    ): Promise<void> {
        try {
            const result = await action.onEnable?.(running.controller.signal);
            if (running.controller.signal.aborted) {
                // A handler may return removed nodes just as it is disabled.
                if (result?.length) action.onDisable?.(result);
                return;
            }
            if (result) running.elements = result;
        } catch (error) {
            if (running.controller.signal.aborted) return;
            running.controller.abort();
            this.runningActions.delete(action.attr);
            action.onDisable?.(running.elements);
            console.error('Unable to enable YouTube Clean feature:', error);
        }
    }

    private notifyGroupChange(plan: FeatureActionPlan, url: string): void {
        const { feature, status } = plan;
        const inScope =
            !feature?.urlRegExp ||
            feature.urlRegExp.some((pattern) => pattern.test(url));
        feature?.onChange?.(status.value, status.enabled && inScope);
    }
}

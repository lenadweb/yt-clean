import { ElementActions, IAttrAction } from 'src/shared/types/config';
import { waitForElement } from 'src/shared/utils/dom';
import { CachedElement, FeatureActionPlan } from 'src/content/features/types';

const isTargetUrl = (action: IAttrAction, url: string): boolean =>
    action.urlRegExp
        ? action.urlRegExp.some((regexp) => new RegExp(regexp).test(url))
        : true;

const setBodyAttribute = (action: IAttrAction, enabled: boolean): void => {
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
        action: IAttrAction,
        featureEnabled: boolean,
        url: string
    ): void {
        const shouldEnable = featureEnabled && isTargetUrl(action, url);

        setBodyAttribute(action, shouldEnable);

        if (action.action === ElementActions.click && shouldEnable) {
            this.clickTargets(action);
        }

        if (action.action === ElementActions.custom) {
            this.runCustomAction(action, shouldEnable);
        }
    }

    private clickTargets(action: IAttrAction): void {
        action.selectors.forEach((selector) => {
            waitForElement(selector).then((element) => {
                if (element) {
                    (element as HTMLElement).click();
                }
            });
        });
    }

    private runCustomAction(action: IAttrAction, shouldEnable: boolean): void {
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
        const { group, status } = plan;

        if (group && 'onChange' in group && group.onChange) {
            group.onChange(status.enabled ? status.value : 'disabled');
        }
    }
}

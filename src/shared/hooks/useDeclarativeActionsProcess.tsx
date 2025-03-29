import { useEffect } from 'react';
import {
    CustomQuerySelectorFn,
    ElementActions,
    IAttrAction,
} from 'src/shared/types/config';
import { useStorage } from 'src/shared/hooks/useStorage';
import { IAttrActionWithStatus } from 'src/shared/hooks/useActions';

export const useDeclarativeActionsProcess = (
    actionsWithStatus: IAttrActionWithStatus[],
    currentUrl: string
) => {
    const [settings] = useStorage();

    useEffect(() => {
        actionsWithStatus.forEach((actionWithStatus) => {
            const enabled = !!actionWithStatus.status.enabled;
            actionWithStatus.action.forEach((action) => {
                const isTargetUrl = action.urlRegExp
                    ? action.urlRegExp.some((regexp) =>
                          new RegExp(regexp).test(currentUrl)
                      )
                    : true;
                if (enabled && isTargetUrl && action.attr) {
                    document.body.setAttribute(action.attr, 'true');
                } else {
                    document.body.removeAttribute(action.attr);
                }
            });
        });
    }, [actionsWithStatus, currentUrl]);

    useEffect(() => {
        actionsWithStatus.forEach(({ action }) => {
            action.forEach(({ selectors, action }) => {
                if (action !== ElementActions.click) return;
                selectors.forEach((selector) => {
                    (
                        document.querySelector(selector) as HTMLButtonElement
                    )?.click();
                });
            });
        });
    }, [settings.autoOpenDescription, currentUrl]);
};

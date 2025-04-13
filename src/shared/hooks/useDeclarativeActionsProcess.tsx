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
        actionsWithStatus.forEach(({ action, status }) => {
            action.forEach(({ selectors, action }) => {
                if (action !== ElementActions.click || !status.enabled) return;
                selectors.forEach((selector) => {
                    (
                        document.querySelector(selector) as HTMLButtonElement
                    )?.click();
                });
            });
        });
    }, [settings.autoOpenDescription, currentUrl]);

    useEffect(() => {
        console.log(currentUrl);
        actionsWithStatus.forEach((item) => {
            if (item.status.enabled && item.group.onChange) {
                console.log(item);
                item.group.onChange(item.status.value);
            }
        });
    }, [
        actionsWithStatus,
        settings.persistentCommentSort.value,
        settings.persistentCommentSort.enabled,
        currentUrl,
    ]);

    useEffect(() => {
        console.log(currentUrl);
        actionsWithStatus.forEach((item) => {
            if (item.status.enabled && item.group.onChange) {
                console.log(item);
                item.group.onChange(item.status.value);
            }
        });
    }, [
        actionsWithStatus,
        settings.persistentCommentSort.value,
        settings.persistentCommentSort.enabled,
        currentUrl,
    ]);
};

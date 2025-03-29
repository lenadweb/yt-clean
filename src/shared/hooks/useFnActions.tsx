import { useEffect, useMemo } from 'react';
import { ElementActions, IAttrAction } from 'src/shared/types/config';
import { DEFAULT_CLASSES } from 'src/shared/config/stylesBuilder';
import { IAttrActionWithStatus } from 'src/shared/hooks/useActions';

const handleFnAction = (
    action: IAttrAction,
    currentUrl: string,
    enabled: boolean
) => {
    if (action.action !== ElementActions.hide) return;
    const isTargetUrl = action.urlRegExp
        ? action.urlRegExp.some((regexp) => new RegExp(regexp).test(currentUrl))
        : true;
    if (action.querySelectorFn) {
        const nodes = action.querySelectorFn();
        nodes.forEach((node) => {
            if (!node) return;
            if (isTargetUrl && enabled) {
                if (!node.classList.contains(DEFAULT_CLASSES.hide)) {
                    node.classList.add(DEFAULT_CLASSES.hide);
                }
            } else {
                if (node.classList.contains(DEFAULT_CLASSES.hide)) {
                    node.classList.remove(DEFAULT_CLASSES.hide);
                }
            }
        });
    }
};

export const useFnActionsProcess = (
    actions: IAttrActionWithStatus[],
    currentUrl: string
) => {
    useEffect(() => {
        const process = () => {
            actions.forEach((action) => {
                action.action.forEach((item) =>
                    handleFnAction(item, currentUrl, !!action.status.enabled)
                );
            });
        };
        const observer = new MutationObserver(() => {
            process();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        process();
        return () => observer.disconnect();
    }, [actions, currentUrl]);
};

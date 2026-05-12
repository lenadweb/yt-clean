import { ElementActions, IConfig } from 'src/shared/types/config';
import { templateConfig } from 'src/shared/config/template';
import { feedConfig } from 'src/shared/config/feed';
import { sidebarConfig } from 'src/shared/config/sidebar';
import { videoConfig } from 'src/shared/config/video';

export const CONFIG: IConfig = {
    domActions: [templateConfig, feedConfig, videoConfig, sidebarConfig],
    storageActions: [],
};

export const getComponentsAction = () =>
    CONFIG.domActions
        .flatMap((item) => item.settings.flatMap(({ groups }) => groups))
        .flatMap((item) => {
            const hasComponents =
                'actions' in item &&
                item.actions.some(
                    ({ action }) => action === ElementActions.component
                );
            return hasComponents
                ? {
                      storageKey: item.storageKey,
                      components: item.actions
                          .filter(
                              ({ action }) =>
                                  action === ElementActions.component
                          )
                          .map(({ component, insertAfter, urlRegExp }) => ({
                              insertAfter: insertAfter as string,
                              component: component as string,
                              urlRegExp,
                          })),
                  }
                : null;
        })
        .filter(Boolean);

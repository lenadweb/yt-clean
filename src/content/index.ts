import {
    ElementActions,
    IAttrAction,
    IConfig,
    IDomActions,
    SettingsGroup,
} from 'src/shared/types/config';
import { DEFAULT_STORAGE, IStorage } from 'src/shared/storage/config';
import { CONFIG } from 'src/shared/config';
import { getAttr } from 'src/shared/utils/getAttr';
import { Storage } from './storage';

type CachedElement = {
    element: Element;
    parent: Node;
    nextSibling: ChildNode | null;
};

interface IAttrActionWithStatus {
    status: { enabled: boolean; value: any };
    actions: IAttrAction[];
    group: SettingsGroup<null> | null;
}

class Content {
    config: IConfig;
    storage: Storage;
    currentUrl: string;
    private elementCache = new Map<string, CachedElement[]>();

    constructor(config: IConfig, defaults: IStorage) {
        this.config = config;
        this.storage = new Storage(defaults);
        this.currentUrl = window.location.href;

        this.observeUrlChanges();
        this.storage.onChange(() => this.processActions());
        this.init();
    }

    observeUrlChanges(): void {
        const observer = new MutationObserver(() => {
            if (window.location.href !== this.currentUrl) {
                this.currentUrl = window.location.href;
                this.processActions();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    init(): void {
        this.processActions();
    }

    processActions() {
        const enabledActions = this.getEnabledActions();
        enabledActions.forEach((item) => {
            const { status, actions, group } = item;
            for (const act of actions) {
                const isTargetUrl = act.urlRegExp
                    ? act.urlRegExp.some((regexp) =>
                          new RegExp(regexp).test(this.currentUrl)
                      )
                    : true;

                if (status.enabled && isTargetUrl && act.attr) {
                    if (getAttr('more-from-yt-group') == act.attr) {
                        console.log(act);
                    }
                    document.body.setAttribute(act.attr, 'true');
                } else if (act.attr) {
                    document.body.removeAttribute(act.attr);
                }

                if (act.action === ElementActions.click && status.enabled) {
                    act.selectors.forEach((selector) => {
                        const element = document.querySelector(
                            selector
                        ) as HTMLElement;
                        if (element) element.click();
                    });
                }

                if (
                    act.action === ElementActions.custom &&
                    status.enabled &&
                    act.onEnable
                ) {
                    act.onEnable().then((result: any) => {
                        console.log(result);
                        if (result && act.attr) {
                            this.elementCache.set(
                                act.attr,
                                result as CachedElement[]
                            );
                        }
                    });
                }

                if (
                    act.action === ElementActions.custom &&
                    !status.enabled &&
                    act.onDisable &&
                    act.attr
                ) {
                    const cached = this.elementCache.get(act.attr);
                    if (cached) {
                        act.onDisable(cached);
                        this.elementCache.delete(act.attr);
                    }
                }
            }

            if (status.enabled && group?.onChange) {
                group.onChange(status.value);
            }
            if (!status.enabled && group?.onChange) {
                group.onChange('disabled');
            }
        });
    }

    getEnabledActions(): IAttrActionWithStatus[] {
        const { domActions } = this.config;
        const settings = this.storage.settings;
        const isEnabled = settings.isEnabled;

        const collectActions = (
            blocks: IDomActions<IAttrAction[]>[]
        ): SettingsGroup<IAttrAction[]>[] =>
            blocks.flatMap((block) => block.groups || []);

        const extractEnabledActions = (
            groups: SettingsGroup<IAttrAction[]>[]
        ): IAttrActionWithStatus[] =>
            groups.map((group) => ({
                status: {
                    enabled:
                        (isEnabled && settings[group.storageKey]?.enabled) ||
                        false,
                    value: (settings[group.storageKey] as any)?.value,
                },
                actions: group.actions,
                group: { ...group, actions: null },
            }));

        const domGroups = collectActions(
            domActions.flatMap((action) => action.settings || [])
        );
        const enabledActions = extractEnabledActions(domGroups);
        const fullEnabledGroupAction: IAttrActionWithStatus[] = domActions
            .flatMap((action) => action.settings || [])
            .map((action) => {
                const allActionsIsEnabled = action.groups
                    .map((item) => !!settings[item.storageKey]?.enabled)
                    .every(Boolean);
                if (action.onFullGroupEnabledActions) {
                    console.log({ allActionsIsEnabled });
                }
                return action.onFullGroupEnabledActions
                    ? [
                          {
                              status: {
                                  enabled: allActionsIsEnabled,
                                  value: null,
                              },
                              actions: action.onFullGroupEnabledActions,
                              group: null,
                          },
                      ]
                    : [];
            })
            .flatMap((value) => value);
        const result = [...enabledActions, ...fullEnabledGroupAction];
        console.log(result);
        return result;
    }
}

new Content(CONFIG, DEFAULT_STORAGE);

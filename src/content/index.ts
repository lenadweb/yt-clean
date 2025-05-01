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
import { Storage } from 'src/shared/storage';
import { waitForDocumentReady } from 'src/shared/utils/browser';
import { waitForElement } from 'src/shared/utils/dom';
import { injectComponents } from 'src/content/components';
import StorageChange = chrome.storage.StorageChange;

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
        this.storage.onChange((changes) => this.processActions(changes));
        this.init();
    }

    observeUrlChanges(): void {
        waitForDocumentReady().then(() => {
            const observer = new MutationObserver(() => {
                if (window.location.href !== this.currentUrl) {
                    this.currentUrl = window.location.href;
                    this.processActions();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    init(): void {
        waitForElement('html body').then(() => {
            this.processActions();
        });
    }

    processActions(changes?: Record<keyof IStorage, StorageChange>) {
        const enabledActions = this.getEnabledActions(changes);
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
                    document.body?.setAttribute(act.attr, 'true');
                } else if (act.attr) {
                    document.body?.removeAttribute(act.attr);
                }

                if (act.action === ElementActions.click && status.enabled) {
                    act.selectors.forEach((selector) => {
                        waitForElement(selector).then((element) => {
                            if (element) (element as HTMLElement).click();
                        });
                    });
                }

                if (
                    act.action === ElementActions.custom &&
                    status.enabled &&
                    act.onEnable
                ) {
                    act.onEnable().then((result: any) => {
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
                    act.onDisable
                ) {
                    act.onDisable(this.elementCache.get(act.attr));
                }
            }

            if (
                status.enabled &&
                group &&
                'onChange' in group &&
                group.onChange
            ) {
                console.log(status.enabled, 'STATUS ENABLED', item);
                group.onChange(status.value);
            }
            if (
                !status.enabled &&
                group &&
                'onChange' in group &&
                group.onChange
            ) {
                group.onChange('disabled');
            }
        });
    }

    getEnabledActions(
        changes?: Record<keyof IStorage, StorageChange>
    ): IAttrActionWithStatus[] {
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
            groups
                .filter(
                    ({ storageKey }) =>
                        (changes && changes?.[storageKey]) || !changes
                )
                .map((group) => ({
                    status: {
                        enabled:
                            (isEnabled &&
                                settings[group.storageKey]?.enabled) ||
                            false,
                        value: (settings[group.storageKey] as any)?.value,
                    },
                    actions: 'actions' in group ? group.actions : [],
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
                const hasChanges = changes
                    ? action.groups.some(
                          ({ storageKey }) => changes?.[storageKey]
                      )
                    : true;
                return action.onFullGroupEnabledActions && hasChanges
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
        return result;
    }
}

new Content(CONFIG, DEFAULT_STORAGE);
injectComponents();

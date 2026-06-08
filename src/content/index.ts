import {
    ElementActions,
    IAttrAction,
    IConfig,
    IDomActions,
    SettingsGroup,
} from 'src/shared/types/config';
import { DEFAULT_STORAGE, IStorage } from 'src/shared/storage/config';
import { CONFIG } from 'src/shared/config';
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
        console.log('[YT-Clean Content] Constructor initialized', {
            url: window.location.href,
        });
        this.config = config;
        this.storage = new Storage(defaults);
        this.currentUrl = window.location.href;

        this.observeUrlChanges();
        this.storage.onChange((changes) => {
            console.log('[YT-Clean Content] Storage change detected', changes);
            this.processActions(changes);
        });
        this.init();
    }

    observeUrlChanges(): void {
        waitForDocumentReady().then(() => {
            console.log(
                '[YT-Clean Content] Document ready, starting MutationObserver for URL changes'
            );
            const observer = new MutationObserver(() => {
                if (window.location.href !== this.currentUrl) {
                    console.log(
                        '[YT-Clean Content] URL changed from',
                        this.currentUrl,
                        'to',
                        window.location.href
                    );
                    this.currentUrl = window.location.href;
                    this.processActions();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    init(): void {
        console.log('[YT-Clean Content] init() waiting for html body');
        waitForElement('html body').then(() => {
            console.log(
                '[YT-Clean Content] html body found, performing initial actions processing'
            );
            this.processActions();
        });
    }

    processActions(changes?: Record<keyof IStorage, StorageChange>) {
        console.log('[YT-Clean Content] processActions called', {
            hasChanges: !!changes,
            isEnabled: this.storage.settings.isEnabled,
        });
        const enabledActions = this.getEnabledActions(changes);
        console.log(
            '[YT-Clean Content] Found enabled actions count:',
            enabledActions.length
        );
        enabledActions.forEach((item) => {
            const { status, actions, group } = item;
            for (const act of actions) {
                const isTargetUrl = act.urlRegExp
                    ? act.urlRegExp.some((regexp) =>
                          new RegExp(regexp).test(this.currentUrl)
                      )
                    : true;

                console.log('[YT-Clean Content] Processing act', {
                    attr: act.attr,
                    action: act.action,
                    enabled: status.enabled,
                    isTargetUrl,
                });

                if (status.enabled && isTargetUrl && act.attr) {
                    console.log(
                        '[YT-Clean Content] Setting attribute',
                        act.attr,
                        'to true'
                    );
                    document.body?.setAttribute(act.attr, 'true');
                } else if (act.attr) {
                    console.log(
                        '[YT-Clean Content] Removing attribute',
                        act.attr
                    );
                    document.body?.removeAttribute(act.attr);
                }

                if (
                    act.action === ElementActions.click &&
                    status.enabled &&
                    isTargetUrl
                ) {
                    console.log(
                        '[YT-Clean Content] Triggering click action for selectors',
                        act.selectors
                    );
                    act.selectors.forEach((selector) => {
                        waitForElement(selector).then((element) => {
                            if (element) {
                                console.log(
                                    '[YT-Clean Content] Clicking element',
                                    selector
                                );
                                (element as HTMLElement).click();
                            }
                        });
                    });
                }

                if (
                    act.action === ElementActions.custom &&
                    status.enabled &&
                    isTargetUrl &&
                    act.onEnable
                ) {
                    console.log(
                        '[YT-Clean Content] Triggering custom onEnable for attr',
                        act.attr
                    );
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
                    act.onDisable &&
                    isTargetUrl
                ) {
                    console.log(
                        '[YT-Clean Content] Triggering custom onDisable for attr',
                        act.attr
                    );
                    act.onDisable(this.elementCache.get(act.attr));
                }
            }

            if (
                status.enabled &&
                group &&
                'onChange' in group &&
                group.onChange
            ) {
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
                        (changes &&
                            (changes?.[storageKey] || changes?.isEnabled)) ||
                        !changes
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
                      ) || changes?.isEnabled
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

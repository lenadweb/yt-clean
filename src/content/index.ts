import { IConfig } from 'src/shared/types/config';
import { DEFAULT_STORAGE, IStorage } from 'src/shared/storage/config';
import { CONFIG } from 'src/shared/config';
import { Storage } from 'src/shared/storage';
import { waitForDocumentReady } from 'src/shared/utils/browser';
import { waitForElement } from 'src/shared/utils/dom';
import { injectComponents } from 'src/content/components';
import { DomActionExecutor } from 'src/content/features/actionExecutor';
import { buildFeatureActionPlans } from 'src/content/features/actionPlan';
import { StorageChanges } from 'src/content/features/types';

class Content {
    private currentUrl = window.location.href;
    private readonly actionExecutor = new DomActionExecutor();
    private readonly config: IConfig;
    private readonly storage: Storage;

    constructor(config: IConfig, defaults: IStorage) {
        this.config = config;
        this.storage = new Storage(defaults);

        this.watchUrlChanges();
        this.storage.onChange((changes) => this.runFeatures(changes));
        this.runWhenBodyIsReady();
    }

    private watchUrlChanges(): void {
        waitForDocumentReady().then(() => {
            const observer = new MutationObserver(() => {
                if (window.location.href !== this.currentUrl) {
                    this.currentUrl = window.location.href;
                    this.runFeatures();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    private runWhenBodyIsReady(): void {
        waitForElement('html body').then(() => {
            this.runFeatures();
        });
    }

    private runFeatures(changes?: StorageChanges): void {
        const actionPlans = buildFeatureActionPlans(
            this.config,
            this.storage.settings,
            changes
        );

        actionPlans.forEach((plan) => {
            this.actionExecutor.run(plan, this.currentUrl);
        });
    }
}

new Content(CONFIG, DEFAULT_STORAGE);
injectComponents();

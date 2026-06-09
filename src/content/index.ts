import { FEATURES } from 'src/shared/featureConfig';
import { storage } from 'src/shared/storage';
import { onUrlChange } from 'src/shared/utils/navigation';
import { waitForElement } from 'src/shared/utils/dom';
import { injectComponents } from 'src/content/components';
import { DomActionExecutor } from 'src/content/features/actionExecutor';
import { buildFeatureActionPlans } from 'src/content/features/actionPlan';
import { StorageChanges } from 'src/content/features/types';
import { Feature } from 'src/shared/types/config';

class Content {
    private currentUrl = window.location.href;
    private readonly actionExecutor = new DomActionExecutor();
    private readonly features: Feature[];

    constructor(features: Feature[]) {
        this.features = features;

        onUrlChange((url) => {
            this.currentUrl = url;
            this.runFeatures();
        });
        storage.onChange((changes) => this.runFeatures(changes));
        this.runWhenBodyIsReady();
    }

    private runWhenBodyIsReady(): void {
        waitForElement('html body').then(() => {
            this.runFeatures();
        });
    }

    private runFeatures(changes?: StorageChanges): void {
        const actionPlans = buildFeatureActionPlans(
            this.features,
            storage.settings,
            changes
        );

        actionPlans.forEach((plan) => {
            this.actionExecutor.run(plan, this.currentUrl);
        });
    }
}

new Content(FEATURES);
injectComponents();

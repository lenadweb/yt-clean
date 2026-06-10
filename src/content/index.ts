import { SECTIONS } from 'src/shared/featureConfig';
import { storage } from 'src/shared/storage';
import { onUrlChange } from 'src/shared/utils/navigation';
import { waitForBody } from 'src/shared/utils/dom';
import { injectComponents } from 'src/content/components';
import { DomActionExecutor } from 'src/content/features/actionExecutor';
import { buildFeatureActionPlans } from 'src/content/features/actionPlan';
import { StorageChanges } from 'src/content/features/types';
import { SettingsSection } from 'src/shared/types/config';

class Content {
    private currentUrl = window.location.href;
    private readonly actionExecutor = new DomActionExecutor();
    private readonly sections: SettingsSection[];

    constructor(sections: SettingsSection[]) {
        this.sections = sections;

        onUrlChange((url) => {
            this.currentUrl = url;
            this.runFeatures();
        });
        storage.onChange((changes) => this.runFeatures(changes));
        this.runWhenBodyIsReady();
    }

    private runWhenBodyIsReady(): void {
        waitForBody().then(() => {
            this.runFeatures();
        });
    }

    private runFeatures(changes?: StorageChanges): void {
        const actionPlans = buildFeatureActionPlans(
            this.sections,
            storage.settings,
            changes
        );

        actionPlans.forEach((plan) => {
            this.actionExecutor.run(plan, this.currentUrl);
        });
    }
}

new Content(SECTIONS);
injectComponents();

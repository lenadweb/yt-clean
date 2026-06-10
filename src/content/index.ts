import { SECTIONS } from 'src/shared/featureConfig';
import { storage } from 'src/shared/storage';
import { onUrlChange } from 'src/shared/utils/navigation';
import { waitForBody } from 'src/shared/utils/dom';
import { injectComponents } from 'src/content/components';
import { DomActionExecutor } from 'src/content/features/actionExecutor';
import { buildFeatureActionPlans } from 'src/content/features/actionPlan';
import { StorageChanges } from 'src/content/features/types';
import { SettingsSection } from 'src/shared/types/config';

const startFeatureRunner = (sections: SettingsSection[]) => {
    const actionExecutor = new DomActionExecutor();
    let currentUrl = window.location.href;

    const runFeatures = (changes?: StorageChanges) => {
        const actionPlans = buildFeatureActionPlans(
            sections,
            storage.settings,
            changes
        );

        actionPlans.forEach((plan) => {
            actionExecutor.run(plan, currentUrl);
        });
    };

    onUrlChange((url) => {
        currentUrl = url;
        runFeatures();
    });
    storage.onChange((changes) => runFeatures(changes));
    waitForBody().then(() => runFeatures());
};

storage.init();
startFeatureRunner(SECTIONS);
injectComponents();

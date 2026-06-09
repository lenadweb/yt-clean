import { IFeatureDraft } from 'src/shared/types/config';
import { templateFeatures } from 'src/shared/config/template';
import { feedFeatures } from 'src/shared/config/feed';
import { sidebarFeatures } from 'src/shared/config/sidebar';
import { videoFeatures } from 'src/shared/config/video';

export const featureDrafts: IFeatureDraft[] = [
    ...templateFeatures,
    ...feedFeatures,
    ...videoFeatures,
    ...sidebarFeatures,
];

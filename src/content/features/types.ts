import { RuntimeAction, Feature } from 'src/shared/types/config';
export type { StorageChanges } from 'src/shared/storage/helpers';

export type FeatureStatus = {
    enabled: boolean;
    value: unknown;
};

export type FeatureActionPlan = {
    status: FeatureStatus;
    actions: RuntimeAction[];
    feature: Feature | null;
};

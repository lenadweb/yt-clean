import { FeatureAction, Feature } from 'src/shared/types/config';
export type { StorageChanges } from 'src/shared/storage/helpers';

export type FeatureStatus = {
    enabled: boolean;
    value: unknown;
};

export type FeatureActionPlan = {
    status: FeatureStatus;
    actions: FeatureAction[];
    feature: Feature | null;
};

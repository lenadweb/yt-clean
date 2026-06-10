import { FeatureAction, Feature } from 'src/shared/types/config';
export type { StorageChanges } from 'src/shared/storage/helpers';

export type FeatureStatus = {
    enabled: boolean;
    value?: string;
};

export type FeatureActionPlan = {
    status: FeatureStatus;
    actions: FeatureAction[];
    feature?: Feature;
};

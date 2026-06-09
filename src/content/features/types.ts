import { IAttrAction, INormalizedFeature } from 'src/shared/types/config';
export type { StorageChanges } from 'src/shared/storage/helpers';

export type CachedElement = {
    element: Element;
    parent: Node;
    nextSibling: ChildNode | null;
};

export type FeatureStatus = {
    enabled: boolean;
    value: unknown;
};

export type FeatureActionPlan = {
    status: FeatureStatus;
    actions: IAttrAction[];
    feature: INormalizedFeature | null;
};

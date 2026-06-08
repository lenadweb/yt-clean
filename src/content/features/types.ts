import { IAttrAction, IFeatureConfig } from 'src/shared/types/config';
import { IStorage } from 'src/shared/storage/config';

export type StorageChanges = Partial<
    Record<keyof IStorage, chrome.storage.StorageChange>
>;

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
    feature: IFeatureConfig | null;
};

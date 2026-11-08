import type { ComponentType } from 'react';
import { ComponentName } from 'src/shared/const';
import PlaybackSpeed from 'src/content/components/PlaybackSpeed';

export const componentRegistry = {
    PlaybackSpeed,
} satisfies Record<ComponentName, ComponentType>;

export type { ComponentName };

export interface ComponentDefinition {
    id: ComponentName;
    targetSelector: string;
    Component: ComponentType;
}

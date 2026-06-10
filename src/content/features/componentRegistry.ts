import type { ComponentType } from 'react';
import { ComponentName } from 'src/shared/const';
import PlaybackSpeed from 'src/content/components/PlaybackSpeed';
import ShortsSpeedControl from 'src/content/components/ShortsSpeedControl';

export const componentRegistry = {
    ShortsSpeedControl,
    PlaybackSpeed,
} satisfies Record<ComponentName, ComponentType>;

export type { ComponentName };

export interface ComponentDefinition {
    id: ComponentName;
    targetSelector: string;
    Component: ComponentType;
}

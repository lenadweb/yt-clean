import type { ComponentType } from 'react';
import PlaybackSpeed from 'src/content/components/PlaybackSpeed';
import ShortsSpeedControl from 'src/content/components/ShortsSpeedControl';

export const componentRegistry = {
    ShortsSpeedControl,
    PlaybackSpeed,
};

export type ComponentName = keyof typeof componentRegistry;

export interface ComponentDefinition {
    id: ComponentName;
    targetSelector: string;
    Component: ComponentType;
}

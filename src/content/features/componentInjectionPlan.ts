import type {
    ComponentDefinition,
    ComponentName,
} from 'src/content/features/componentRegistry';
import { componentRegistry } from 'src/content/features/componentRegistry';
import { getComponentsAction } from 'src/shared/featureConfig';
import { getFeatureSetting, StorageState } from 'src/shared/storage/config';
import { waitForElement } from 'src/shared/utils/dom';

type ComponentConfig = ReturnType<typeof getComponentsAction>[number];
type ComponentAction = ComponentConfig['components'][number];

export interface MountedComponent extends ComponentDefinition {
    element: Element;
}

const matchesUrl = (component: ComponentAction, url: string): boolean =>
    component.urlRegExp
        ? component.urlRegExp.some((regexp) => regexp.test(url))
        : true;

const isFeatureEnabled = (
    config: ComponentConfig,
    storage: StorageState
): boolean =>
    Boolean(
        getFeatureSetting(storage, config.id)?.enabled &&
        config.components.length
    );

const getComponentDefinition = (
    component: ComponentAction,
    url: string
): ComponentDefinition | null => {
    if (!matchesUrl(component, url)) {
        return null;
    }

    return {
        id: component.component,
        targetSelector: component.insertAfter || 'body',
        Component: componentRegistry[component.component],
    };
};

export const getActiveComponentDefinitions = (
    storage: StorageState,
    url: string
): ComponentDefinition[] =>
    getComponentsAction()
        .filter((config) => isFeatureEnabled(config, storage))
        .flatMap((config) =>
            config.components.flatMap((component) => {
                const definition = getComponentDefinition(component, url);
                return definition ? [definition] : [];
            })
        );

export const getComponentIds = (
    components: ComponentDefinition[]
): Set<ComponentName> => new Set(components.map(({ id }) => id));

export const keepActiveComponents = (
    components: MountedComponent[],
    activeIds: Set<ComponentName>
): MountedComponent[] => components.filter(({ id }) => activeIds.has(id));

export const addMountedComponent = (
    components: MountedComponent[],
    nextComponent: MountedComponent
): MountedComponent[] =>
    components.some(({ id }) => id === nextComponent.id)
        ? components
        : [...components, nextComponent];

export const findComponentTarget = async (
    definition: ComponentDefinition,
    signal?: AbortSignal
): Promise<MountedComponent | null> => {
    const element = await waitForElement(definition.targetSelector, 0, signal);
    return element ? { ...definition, element } : null;
};

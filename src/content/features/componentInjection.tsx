import React, {
    ComponentType,
    FC,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { Injection } from 'src/content/Injection';
import PlaybackSpeed from 'src/content/components/PlaybackSpeed';
import ShortsSpeedControl from 'src/content/components/ShortsSpeedControl';
import ShadowRoot from 'src/content/ShadowRoot';
import { getComponentsAction } from 'src/shared/config';
import { IStorage } from 'src/shared/storage/config';
import { waitForElement } from 'src/shared/utils/dom';

const componentRegistry = {
    ShortsSpeedControl,
    PlaybackSpeed,
};

type ComponentName = keyof typeof componentRegistry;
type ComponentConfig = ReturnType<typeof getComponentsAction>[number];
type ComponentAction = ComponentConfig['components'][number];

interface ComponentDefinition {
    id: ComponentName;
    targetSelector: string;
    Component: ComponentType;
}

export interface MountedComponent extends ComponentDefinition {
    element: Element;
}

const isRegisteredComponent = (name: string): name is ComponentName =>
    name in componentRegistry;

const matchesUrl = (component: ComponentAction, url: string): boolean =>
    component.urlRegExp
        ? component.urlRegExp.some((regexp) => new RegExp(regexp).test(url))
        : true;

const isFeatureEnabled = (
    config: ComponentConfig,
    storage: IStorage
): boolean => Boolean(storage[config.id]?.enabled && config.components.length);

const getComponentDefinition = (
    component: ComponentAction,
    url: string
): ComponentDefinition | null => {
    if (
        !isRegisteredComponent(component.component) ||
        !matchesUrl(component, url)
    ) {
        return null;
    }

    return {
        id: component.component,
        targetSelector: component.insertAfter || 'body',
        Component: componentRegistry[component.component],
    };
};

const getActiveComponentDefinitions = (
    storage: IStorage,
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

const getComponentIds = (
    components: ComponentDefinition[]
): Set<ComponentName> => new Set(components.map(({ id }) => id));

const keepActiveComponents = (
    components: MountedComponent[],
    activeIds: Set<ComponentName>
): MountedComponent[] => components.filter(({ id }) => activeIds.has(id));

const addMountedComponent = (
    components: MountedComponent[],
    nextComponent: MountedComponent
): MountedComponent[] =>
    components.some(({ id }) => id === nextComponent.id)
        ? components
        : [...components, nextComponent];

const findComponentTarget = async (
    definition: ComponentDefinition
): Promise<MountedComponent | null> => {
    const element = await waitForElement(definition.targetSelector);
    return element ? { ...definition, element } : null;
};

export const useMountedComponents = (
    storage: IStorage,
    url: string
): MountedComponent[] => {
    const [mountedComponents, setMountedComponents] = useState<
        MountedComponent[]
    >([]);

    const componentDefinitions = useMemo(
        () => getActiveComponentDefinitions(storage, url),
        [storage, url]
    );

    useEffect(() => {
        let isCancelled = false;
        const activeIds = getComponentIds(componentDefinitions);

        setMountedComponents((components) =>
            keepActiveComponents(components, activeIds)
        );

        componentDefinitions.forEach((definition) => {
            findComponentTarget(definition).then((mountedComponent) => {
                if (isCancelled || !mountedComponent) return;

                setMountedComponents((components) =>
                    addMountedComponent(components, mountedComponent)
                );
            });
        });

        return () => {
            isCancelled = true;
        };
    }, [componentDefinitions]);

    return mountedComponents;
};

export const InjectedComponent: FC<MountedComponent> = ({
    element,
    Component,
}) => {
    const selectTargetElement = useCallback(() => element, [element]);

    return (
        <Injection
            selectTargetElement={selectTargetElement}
            position="beforebegin"
        >
            <ShadowRoot>
                <Component />
            </ShadowRoot>
        </Injection>
    );
};

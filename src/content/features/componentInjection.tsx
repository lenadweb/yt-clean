import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Injection } from 'src/content/Injection';
import ShadowRoot from 'src/content/ShadowRoot';
import { IStorage } from 'src/shared/storage/config';
import {
    addMountedComponent,
    findComponentTarget,
    getActiveComponentDefinitions,
    getComponentIds,
    keepActiveComponents,
} from 'src/content/features/componentInjectionPlan';
import type { MountedComponent } from 'src/content/features/componentInjectionPlan';

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
        const controller = new AbortController();
        const activeIds = getComponentIds(componentDefinitions);

        setMountedComponents((components) =>
            keepActiveComponents(components, activeIds)
        );

        componentDefinitions.forEach((definition) => {
            findComponentTarget(definition, controller.signal).then(
                (mountedComponent) => {
                    if (!mountedComponent) return;

                    setMountedComponents((components) =>
                        addMountedComponent(components, mountedComponent)
                    );
                }
            );
        });

        return () => {
            controller.abort();
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

import React, { FC, ReactElement, useEffect, useState } from 'react';
import ShadowRoot from 'src/content/ShadowRoot';
import { useStorage } from 'src/shared/hooks/useStorage';
import { getComponentsAction } from 'src/shared/config';
import ShortsSpeedControl from 'src/content/components/ShortsSpeedControl';
import { Injection } from 'src/content/Injection';
import { waitForElement } from 'src/shared/utils/dom';
import PlaybackSpeed from 'src/content/components/PlaybackSpeed';
import { useUrl } from 'src/shared/hooks/useUrl';
import { IStorage } from 'src/shared/storage/config';

const componentRegistry: Record<string, ReactElement> = {
    ShortsSpeedControl: <ShortsSpeedControl />,
    PlaybackSpeed: <PlaybackSpeed />,
};

interface RenderableComponent {
    id: string;
    element: Element;
    component: ReactElement;
}

type ComponentConfig = ReturnType<typeof getComponentsAction>[number];

const isTargetUrl = (
    component: ComponentConfig['components'][number],
    url: string
): boolean =>
    component.urlRegExp
        ? component.urlRegExp.some((regexp) => new RegExp(regexp).test(url))
        : true;

const getComponentId = (
    component: ComponentConfig['components'][number]
): string => component.component;

const getComponentTargetSelector = (
    component: ComponentConfig['components'][number]
): string => component.insertAfter || 'body';

const getEnabledComponentConfigs = (storage: IStorage): ComponentConfig[] =>
    getComponentsAction().filter(
        (item) => storage[item.storageKey]?.enabled && item.components.length
    );

const stillEnabled = (
    id: string,
    componentConfigs: ComponentConfig[]
): boolean =>
    componentConfigs.some((item) =>
        item.components.some((component) => getComponentId(component) === id)
    );

const App: FC = () => {
    const url = useUrl();
    const [storage] = useStorage();
    const [readyComponents, setReadyComponents] = useState<
        RenderableComponent[]
    >([]);

    useEffect(() => {
        const enabledItems = getEnabledComponentConfigs(storage);

        setReadyComponents((prev) =>
            prev.filter(({ id }) => stillEnabled(id, enabledItems))
        );

        enabledItems.forEach((item) => {
            item.components.forEach((componentDef) => {
                const id = getComponentId(componentDef);
                const component = componentRegistry[id];

                if (!component || !isTargetUrl(componentDef, url)) return;

                waitForElement(getComponentTargetSelector(componentDef)).then(
                    (el) => {
                        if (!el) return;
                        setReadyComponents((prev) => {
                            if (prev.some((item) => item.id === id))
                                return prev;
                            return [
                                ...prev,
                                {
                                    id,
                                    element: el,
                                    component,
                                },
                            ];
                        });
                    }
                );
            });
        });
    }, [url, storage.shortSpeedControl.enabled, storage.speedControl.enabled]);

    return (
        <>
            {readyComponents.map(({ id, element, component }) => (
                <Injection
                    key={id}
                    selectTargetElement={() => element}
                    position="beforebegin"
                >
                    <ShadowRoot>{component}</ShadowRoot>
                </Injection>
            ))}
        </>
    );
};

export default App;

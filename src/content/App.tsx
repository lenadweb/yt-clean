import React, { FC, ReactElement, useEffect, useState } from 'react';
import ShadowRoot from 'src/content/ShadowRoot';
import { useStorage } from 'src/shared/hooks/useStorage';
import { getComponentsAction } from 'src/shared/config';
import ShortsSpeedControl from 'src/content/components/ShortsSpeedControl';
import { Injection } from 'src/content/Injection';
import { waitForElement } from 'src/shared/utils/dom';

const components = getComponentsAction();

const componentsMap: Record<string, ReactElement> = {
    ShortsSpeedControl: <ShortsSpeedControl />,
};

interface RenderableComponent {
    id: string;
    element: Element;
    component: ReactElement;
}

const App: FC = () => {
    const [storage] = useStorage();
    const [readyComponents, setReadyComponents] = useState<
        RenderableComponent[]
    >([]);

    useEffect(() => {
        const enabledItems = components.filter(
            (item) =>
                item?.storageKey &&
                storage[item.storageKey]?.enabled &&
                item.components.length
        );

        enabledItems.forEach((item) => {
            item?.components.forEach((componentDef) => {
                const key = componentDef.component || 'default';
                const selector = componentDef.insertAfter || 'body';

                waitForElement(selector).then((el) => {
                    if (!el) return;
                    setReadyComponents((prev) => {
                        if (prev.some((c) => c.id === key)) return prev;
                        return [
                            ...prev,
                            {
                                id: key,
                                element: el,
                                component: componentsMap[key],
                            },
                        ];
                    });
                });
            });
        });
    }, [storage.shortSpeedControl.enabled]);

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

import React, { FC, ReactElement, useEffect, useState } from 'react';
import ShadowRoot from 'src/content/ShadowRoot';
import { useStorage } from 'src/shared/hooks/useStorage';
import { getComponentsAction } from 'src/shared/config';
import ShortsSpeedControl from 'src/content/components/ShortsSpeedControl';
import { Injection } from 'src/content/Injection';
import { waitForElement } from 'src/shared/utils/dom';
import PlaybackSpeed from 'src/content/components/PlaybackSpeed';

const componentsMap: Record<string, ReactElement> = {
    ShortsSpeedControl: <ShortsSpeedControl />,
    PlaybackSpeed: <PlaybackSpeed />,
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
        const enabledItems = getComponentsAction().filter(
            (item) =>
                item?.storageKey &&
                storage[item.storageKey]?.enabled &&
                item.components.length
        );

        setReadyComponents((prev) =>
            prev.filter(({ id }) =>
                enabledItems.some((item) =>
                    item?.components.some((comp) => comp.component === id)
                )
            )
        );

        console.log(enabledItems, storage.shortSpeedControl.enabled);

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
    }, [
        storage.shortSpeedControl.enabled,
        storage.persistentPlaybackSpeed.enabled,
    ]);

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

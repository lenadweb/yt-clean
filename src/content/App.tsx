import React, { FC } from 'react';
import { useStorage } from 'src/shared/hooks/useStorage';
import { useUrl } from 'src/shared/hooks/useUrl';
import {
    InjectedComponent,
    useMountedComponents,
} from 'src/content/features/componentInjection';

const App: FC = () => {
    const url = useUrl();
    const [storage] = useStorage();
    const mountedComponents = useMountedComponents(storage, url);

    return (
        <>
            {mountedComponents.map((component) => (
                <InjectedComponent key={component.id} {...component} />
            ))}
        </>
    );
};

export default App;

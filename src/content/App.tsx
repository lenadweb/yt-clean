import { FC, useEffect } from 'react';
import { ElementActions, IConfig } from 'src/shared/types/config';

import { useActionProcess } from 'src/shared/hooks/useActionProcess';
import { useActions } from 'src/shared/hooks/useActions';

const App: FC<IConfig> = (config) => {
    const actions = useActions(config);
    useActionProcess(actions);

    return null;
};

export default App;

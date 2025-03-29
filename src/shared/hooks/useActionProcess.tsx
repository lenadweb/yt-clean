import { IAttrAction } from 'src/shared/types/config';

import { useDeclarativeActionsProcess } from 'src/shared/hooks/useDeclarativeActionsProcess';
import { useFnActionsProcess } from 'src/shared/hooks/useFnActions';
import { useUrl } from 'src/shared/hooks/useUrl';
import { IAttrActionWithStatus } from 'src/shared/hooks/useActions';

export const useActionProcess = (actions: IAttrActionWithStatus[]) => {
    const currentUrl = useUrl();
    useDeclarativeActionsProcess(actions, currentUrl);
    // useFnActionsProcess(actions, currentUrl); // temp
};

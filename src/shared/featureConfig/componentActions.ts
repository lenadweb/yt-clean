import {
    ElementActions,
    IAttrAction,
    IComponentAction,
    INormalizedFeature,
} from 'src/shared/types/config';
import { ISettings } from 'src/shared/types/settings';

type ComponentAction = Pick<
    IComponentAction,
    'component' | 'insertAfter' | 'urlRegExp'
>;

export type ComponentActionGroup = {
    id: keyof ISettings;
    components: ComponentAction[];
};

const isComponentAction = (
    action: IAttrAction
): action is IAttrAction & ComponentAction =>
    action.action === ElementActions.component;

export const getComponentActionGroups = (
    features: INormalizedFeature[]
): ComponentActionGroup[] =>
    features.flatMap((feature) => {
        const components = feature.actions
            .filter(isComponentAction)
            .map(({ component, insertAfter, urlRegExp }) => ({
                component,
                insertAfter,
                urlRegExp,
            }));

        return components.length
            ? [
                  {
                      id: feature.id,
                      components,
                  },
              ]
            : [];
    });

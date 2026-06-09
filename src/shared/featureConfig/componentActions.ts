import {
    ElementActions,
    RuntimeAction,
    ComponentAction as FeatureComponentAction,
    Feature,
} from 'src/shared/types/config';

type ComponentMountAction = Pick<
    FeatureComponentAction,
    'component' | 'insertAfter' | 'urlRegExp'
>;

export type ComponentActionGroup = {
    id: Feature['id'];
    components: ComponentMountAction[];
};

const isComponentAction = (
    action: RuntimeAction
): action is RuntimeAction & FeatureComponentAction =>
    action.action === ElementActions.component;

export const getComponentActionGroups = (
    features: Feature[]
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

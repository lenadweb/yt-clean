import {
    IActionConfig,
    ICustomAction,
    IFeatureDraft,
    I18nKey,
    ISettingsSectionOptions,
    UrlRegExp,
} from 'src/shared/types/config';
import { ISettings } from 'src/shared/types/settings';
import {
    componentAction,
    customAction,
    hideAction,
    stylesAction,
} from 'src/shared/featureConfig/helpers';

type ComponentDefinition = {
    name: string;
    after: string;
};

type CustomDefinition = {
    enable?: ICustomAction['onEnable'];
    disable?: ICustomAction['onDisable'];
};

type ActionFields = {
    url?: UrlRegExp[];
    hide?: string[];
    styles?: string[];
    component?: ComponentDefinition;
    custom?: true | CustomDefinition;
};

type SectionOptions = Omit<
    ISettingsSectionOptions,
    'onFullGroupEnabledActions'
> & {
    whenAllEnabled?: ActionFields;
};

type FeatureInput = ActionFields & {
    id: keyof ISettings;
    title?: I18nKey;
    isNew?: boolean;
    onChange?: IFeatureDraft['onChange'];
};

const getActions = ({
    url,
    hide,
    styles,
    component,
    custom,
}: ActionFields): IActionConfig[] => [
    ...(hide ? [hideAction(hide, { urlRegExp: url })] : []),
    ...(styles ? [stylesAction(styles, { urlRegExp: url })] : []),
    ...(component
        ? [componentAction(component.name, component.after, { urlRegExp: url })]
        : []),
    ...(custom
        ? [
              customAction(
                  custom === true
                      ? { urlRegExp: url }
                      : {
                            urlRegExp: url,
                            onEnable: custom.enable,
                            onDisable: custom.disable,
                        }
              ),
          ]
        : []),
];

const getSectionOptions = (
    sectionOptions?: SectionOptions
): ISettingsSectionOptions | undefined => {
    if (!sectionOptions) return undefined;

    const { whenAllEnabled, ...uiOptions } = sectionOptions;

    return {
        ...uiOptions,
        onFullGroupEnabledActions: whenAllEnabled
            ? getActions(whenAllEnabled)
            : undefined,
    };
};

export const defineCategory = (categoryKey: I18nKey) => ({
    section: (sectionKey: I18nKey, sectionOptions?: SectionOptions) => {
        const ui = getSectionOptions(sectionOptions);

        return {
            feature: (feature: FeatureInput): IFeatureDraft => ({
                categoryKey,
                sectionKey,
                titleKey: feature.title,
                id: feature.id,
                isNew: feature.isNew,
                actions: getActions(feature),
                onChange: feature.onChange,
                ui,
            }),
        };
    },
});

import {
    ActionConfig,
    CustomAction,
    FeatureDraft,
    I18nKey,
    SettingsSectionOptions,
    UrlRegExp,
} from 'src/shared/types/config';
import { SettingsState } from 'src/shared/types/settings';
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
    enable?: CustomAction['onEnable'];
    disable?: CustomAction['onDisable'];
};

type ActionFields = {
    url?: UrlRegExp[];
    hide?: string[];
    styles?: string[];
    component?: ComponentDefinition;
    custom?: true | CustomDefinition;
};

type SectionOptions = Omit<
    SettingsSectionOptions,
    'onFullGroupEnabledActions'
> & {
    whenAllEnabled?: ActionFields;
};

type FeatureInput = ActionFields & {
    id: keyof SettingsState;
    title?: I18nKey;
    isNew?: boolean;
    defaultEnabled?: boolean;
    defaultValue?: string;
    onChange?: FeatureDraft['onChange'];
};

const getActions = ({
    url,
    hide,
    styles,
    component,
    custom,
}: ActionFields): ActionConfig[] => [
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
): SettingsSectionOptions | undefined => {
    if (!sectionOptions) return undefined;

    const { whenAllEnabled, ...uiOptions } = sectionOptions;

    return {
        ...uiOptions,
        onFullGroupEnabledActions: whenAllEnabled
            ? getActions(whenAllEnabled)
            : undefined,
    };
};

export const defineCategory = (category: I18nKey) => ({
    section: (section: I18nKey, sectionOptions?: SectionOptions) => {
        const ui = getSectionOptions(sectionOptions);

        return {
            feature: (feature: FeatureInput): FeatureDraft => ({
                category,
                section,
                title: feature.title,
                id: feature.id,
                isNew: feature.isNew,
                defaultEnabled: feature.defaultEnabled,
                defaultValue: feature.defaultValue,
                actions: getActions(feature),
                onChange: feature.onChange,
                ui,
            }),
        };
    },
});

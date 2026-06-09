import {
    IActionConfig,
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
} from 'src/shared/config/helpers';

type ComponentDefinition = {
    name: string;
    after: string;
    url?: UrlRegExp[];
};

type CustomDefinition = {
    enable?: IActionConfig['onEnable'];
    disable?: IActionConfig['onDisable'];
    url?: UrlRegExp[];
};

type ActionFields = {
    url?: UrlRegExp[];
    hide?: string[];
    styles?: string[];
    component?: ComponentDefinition | ComponentDefinition[];
    custom?: true | CustomDefinition | CustomDefinition[];
    actions?: IActionConfig[];
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
    titleKey?: I18nKey;
    isNew?: boolean;
    onChange?: IFeatureDraft['onChange'];
    ui?: ISettingsSectionOptions;
};

const toArray = <T>(value: T | T[] | undefined): T[] => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
};

const getUrlRegExp = (
    actionUrl: UrlRegExp[] | undefined,
    featureUrl: UrlRegExp[] | undefined
): UrlRegExp[] | undefined => actionUrl ?? featureUrl;

const getComponentActions = ({
    component,
    url,
}: ActionFields): IActionConfig[] =>
    toArray(component).map((item) =>
        componentAction(item.name, item.after, {
            urlRegExp: getUrlRegExp(item.url, url),
        })
    );

const getCustomActions = ({ custom, url }: ActionFields): IActionConfig[] =>
    toArray(custom).map((item) => {
        if (item === true) {
            return customAction({ urlRegExp: url });
        }

        return customAction({
            urlRegExp: getUrlRegExp(item.url, url),
            onEnable: item.enable,
            onDisable: item.disable,
        });
    });

const getActions = (fields: ActionFields): IActionConfig[] => [
    ...(fields.hide
        ? [hideAction(fields.hide, { urlRegExp: fields.url })]
        : []),
    ...(fields.styles
        ? [stylesAction(fields.styles, { urlRegExp: fields.url })]
        : []),
    ...getComponentActions(fields),
    ...getCustomActions(fields),
    ...(fields.actions ?? []),
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
                titleKey: feature.titleKey ?? feature.title,
                id: feature.id,
                isNew: feature.isNew,
                actions: getActions(feature),
                onChange: feature.onChange,
                ui: {
                    ...ui,
                    ...feature.ui,
                },
            }),
        };
    },
});

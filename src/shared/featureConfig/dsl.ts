import {
    CustomAction,
    ElementActions,
    Feature,
    FeatureAction,
    I18nKey,
    SectionControls,
    SettingsCategory,
    SettingsSection,
} from 'src/shared/types/config';
import { ComponentName } from 'src/shared/const';
import { getAttr } from 'src/shared/utils/getAttr';

type ComponentDefinition = {
    name: ComponentName;
    after: string;
};

type CustomDefinition = {
    enable?: CustomAction['onEnable'];
    disable?: CustomAction['onDisable'];
};

type SectionOptions = {
    isNew?: boolean;
    isExperimental?: boolean;
    controls?: SectionControls;
    hideWhenAllEnabled?: string[];
};

type FeatureInput<TId extends string = string> = {
    id: TId;
    title?: I18nKey;
    isNew?: boolean;
    isExperimental?: boolean;
    defaultEnabled?: boolean;
    onChange?: Feature['onChange'];
    url?: RegExp[];
    hide?: string[];
    styles?: string[];
    component?: ComponentDefinition;
    custom?: true | CustomDefinition;
};

type SectionDraft<TId extends string> = (
    category: I18nKey
) => SettingsSection<TId>;

const toKebabCase = (value: string): string =>
    value
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase();

const getActions = (
    { url, hide, styles, component, custom }: FeatureInput,
    attr: string
): FeatureAction[] => {
    const actions: FeatureAction[] = [];

    if (hide) {
        actions.push({
            action: ElementActions.hide,
            selectors: hide,
            urlRegExp: url,
            attr,
        });
    }

    if (styles) {
        actions.push({
            action: ElementActions.customStyles,
            customStyles: styles,
            urlRegExp: url,
            attr,
        });
    }

    if (component) {
        actions.push({
            action: ElementActions.component,
            component: component.name,
            insertAfter: component.after,
            urlRegExp: url,
            attr,
        });
    }

    if (custom) {
        actions.push({
            action: ElementActions.custom,
            urlRegExp: url,
            attr,
            ...(custom === true
                ? {}
                : { onEnable: custom.enable, onDisable: custom.disable }),
        });
    }

    return actions;
};

export const feature = <const TId extends string>(
    input: FeatureInput<TId>
): Feature<TId> => ({
    id: input.id,
    title: input.title,
    isNew: input.isNew,
    isExperimental: input.isExperimental,
    defaultEnabled: input.defaultEnabled,
    onChange: input.onChange,
    actions: getActions(input, getAttr(`feature-${toKebabCase(input.id)}`)),
});

export function section<TId extends string>(
    title: I18nKey,
    features: Feature<TId>[]
): SectionDraft<TId>;
export function section<TId extends string>(
    title: I18nKey,
    options: SectionOptions,
    features: Feature<TId>[]
): SectionDraft<TId>;
export function section<TId extends string>(
    title: I18nKey,
    optionsOrFeatures: SectionOptions | Feature<TId>[],
    maybeFeatures?: Feature<TId>[]
): SectionDraft<TId> {
    const hasOptions = !Array.isArray(optionsOrFeatures);
    const { hideWhenAllEnabled, ...uiOptions } = hasOptions
        ? optionsOrFeatures
        : ({} as SectionOptions);
    const features = hasOptions
        ? (maybeFeatures ?? [])
        : (optionsOrFeatures as Feature<TId>[]);

    return (category) => ({
        title,
        ...uiOptions,
        onFullGroupEnabledActions: hideWhenAllEnabled
            ? [
                  {
                      action: ElementActions.hide,
                      selectors: hideWhenAllEnabled,
                      attr: getAttr(
                          `section-${toKebabCase(category)}-${toKebabCase(
                              title
                          )}`
                      ),
                  },
              ]
            : undefined,
        features,
    });
}

export const category = <TId extends string>(
    title: I18nKey,
    sections: SectionDraft<TId>[]
): SettingsCategory<TId> => ({
    title,
    sections: sections.map((buildSection) => buildSection(title)),
});

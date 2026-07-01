import React, { FC } from 'react';
import cn from 'classnames';
import { Checkbox } from 'src/sidebar/components/Checkbox';
import { Feature, I18nKey, SectionControls } from 'src/shared/types/config';
import {
    getFeatureSetting,
    SettingsState,
    StorageState,
    toFeatureId,
} from 'src/shared/storage/config';
import { useStorage } from 'src/shared/hooks/useStorage';
import { storage } from 'src/shared/storage';
import { isStandardPreset } from 'src/shared/presets';
import Divider from 'src/sidebar/components/Divider';
import Switch from 'src/sidebar/components/Switch';
import { NewBadge } from 'src/sidebar/components/NewBadge';
import { ExperimentalBadge } from 'src/sidebar/components/ExperimentalBadge';
import { useExperimentalConfirm } from 'src/sidebar/components/ExperimentalModal';
import { usePresetWarning } from 'src/sidebar/components/PresetWarningModal';
import { t } from 'src/shared/utils/i18n';

interface SettingsGroupProps {
    title: I18nKey;
    isFirst: boolean;
    isNew?: boolean;
    isExperimental?: boolean;
    features: Feature[];
    controls?: SectionControls;
}

const isGroupEnabled = (features: Feature[], settings: StorageState): boolean =>
    features.some(({ id }) =>
        Boolean(getFeatureSetting(settings, id)?.enabled)
    );

const SettingsGroup: FC<SettingsGroupProps> = ({
    features,
    isFirst,
    isNew,
    isExperimental,
    controls,
    title,
}) => {
    const [settings] = useStorage();
    const confirmExperimental = useExperimentalConfirm();
    const confirmPresetEdit = usePresetWarning();
    const enabled = settings.isEnabled;
    const groupEnabled = isGroupEnabled(features, settings);

    const applyFeatures = (ids: string[], value: boolean) => {
        const values = Object.fromEntries(
            ids.map((id) => [
                toFeatureId(id),
                { ...getFeatureSetting(settings, id), enabled: value },
            ])
        ) as Partial<SettingsState>;

        storage.setFeatures(values);
    };

    const confirmIfExperimental = async (
        isExperimentalItem: boolean
    ): Promise<boolean> => !isExperimentalItem || (await confirmExperimental());

    const confirmIfPreset = async (): Promise<boolean> =>
        !isStandardPreset(settings.activePreset) ||
        settings.presetWarningDismissed ||
        (await confirmPresetEdit());

    const toggleFeature = async (feature: Feature, value: boolean) => {
        if (!(await confirmIfPreset())) return;
        if (value && !(await confirmIfExperimental(!!feature.isExperimental))) {
            return;
        }
        applyFeatures([feature.id], value);
    };

    const setGroupEnabled = async (value: boolean) => {
        const hasExperimental =
            isExperimental ||
            features.some((feature) => feature.isExperimental);

        if (!(await confirmIfPreset())) return;
        if (value && !(await confirmIfExperimental(hasExperimental))) {
            return;
        }

        applyFeatures(
            features.map((feature) => feature.id),
            value
        );
    };
    return (
        <div className="last:!mb-2">
            {!isFirst && <Divider />}
            <div className="mb-4 flex items-center justify-between">
                <div
                    className={cn(
                        'mr-auto flex items-center gap-2 text-sm leading-[1.2] transition-colors',
                        {
                            'text-white-100': enabled,
                            'text-[#51515C]': !enabled,
                        }
                    )}
                >
                    {t(title)}
                    {isNew && <NewBadge />}
                    {isExperimental && <ExperimentalBadge />}
                </div>
                {controls !== 'checkboxes' ? (
                    <Switch
                        disabled={!enabled}
                        enabled={groupEnabled}
                        setEnabled={setGroupEnabled}
                    />
                ) : null}
            </div>
            {controls !== 'switch' ? (
                <div className="ml-3 flex flex-col gap-3">
                    {features.map((feature) => (
                        <Checkbox
                            key={feature.id}
                            isGrey={!groupEnabled}
                            isNew={feature.isNew}
                            isExperimental={feature.isExperimental}
                            label={feature.title ? t(feature.title) : ''}
                            checked={
                                getFeatureSetting(settings, feature.id)
                                    ?.enabled ?? false
                            }
                            disabled={!enabled}
                            onChange={(value) => {
                                void toggleFeature(feature, value);
                            }}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default SettingsGroup;

import React, { FC } from 'react';
import cn from 'classnames';
import { Checkbox } from 'src/sidebar/components/Checkbox';
import { Feature, I18nKey, SectionControls } from 'src/shared/types/config';
import {
    getFeatureSetting,
    StorageState,
    toFeatureId,
} from 'src/shared/storage/config';
import { useStorage } from 'src/shared/hooks/useStorage';
import Divider from 'src/sidebar/components/Divider';
import Switch from 'src/sidebar/components/Switch';
import { NewBadge } from 'src/sidebar/components/NewBadge';
import { ExperimentalBadge } from 'src/sidebar/components/ExperimentalBadge';
import { useToast } from 'src/sidebar/components/Toast';
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
    const [settings, updateSettings] = useStorage();
    const { showToast } = useToast();
    const enabled = settings.isEnabled;
    const groupEnabled = isGroupEnabled(features, settings);

    const setFeatureEnabled = (id: string, value: boolean) => {
        updateSettings(toFeatureId(id), {
            ...getFeatureSetting(settings, id),
            enabled: value,
        });
    };

    const notifyExperimental = (isExperimentalItem?: boolean) => {
        if (isExperimentalItem) {
            showToast(t('experimental_notice'));
        }
    };

    const setGroupEnabled = (value: boolean) => {
        features.forEach((feature) => {
            setFeatureEnabled(feature.id, value);
        });
        if (value) {
            notifyExperimental(
                isExperimental ||
                    features.some((feature) => feature.isExperimental)
            );
        }
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
                                setFeatureEnabled(feature.id, value);
                                if (value) {
                                    notifyExperimental(feature.isExperimental);
                                }
                            }}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default SettingsGroup;

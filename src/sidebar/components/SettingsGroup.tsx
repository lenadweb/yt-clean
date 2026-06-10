import React, { FC } from 'react';
import cn from 'classnames';
import { Checkbox } from 'src/sidebar/components/Checkbox';
import { Feature, I18nKey, SectionControls } from 'src/shared/types/config';
import {
    FeatureId,
    getFeatureSetting,
    StorageState,
    toFeatureId,
} from 'src/shared/storage/config';
import Divider from 'src/sidebar/components/Divider';
import Switch from 'src/sidebar/components/Switch';
import { SettingValue } from 'src/shared/types/settings';
import { NewBadge } from 'src/sidebar/components/NewBadge';
import { t } from 'src/shared/utils/i18n';

interface SettingsGroupProps {
    title: I18nKey;
    isFirst: boolean;
    enabled: boolean;
    isNew?: boolean;
    features: Feature[];
    controls?: SectionControls;
    settings: StorageState;
    setSetting: (key: FeatureId, value: SettingValue) => void;
}

const isGroupEnabled = (features: Feature[], settings: StorageState): boolean =>
    features.some(({ id }) =>
        Boolean(getFeatureSetting(settings, id)?.enabled)
    );

const SettingsGroup: FC<SettingsGroupProps> = ({
    features,
    isFirst,
    enabled,
    isNew,
    controls,
    settings,
    setSetting,
    title,
}) => {
    const groupEnabled = isGroupEnabled(features, settings);

    const setGroupEnabled = (value: boolean) => {
        features.forEach((item) => {
            setSetting(toFeatureId(item.id), {
                ...getFeatureSetting(settings, item.id),
                enabled: value,
            });
        });
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
                            label={feature.title ? t(feature.title) : ''}
                            checked={
                                getFeatureSetting(settings, feature.id)
                                    ?.enabled ?? false
                            }
                            disabled={!enabled}
                            onChange={(value) =>
                                setSetting(toFeatureId(feature.id), {
                                    enabled: value,
                                })
                            }
                        />
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default SettingsGroup;

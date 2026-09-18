import React, { FC } from 'react';
import cn from 'classnames';
import { I18nKey } from 'src/shared/types/config';
import { useStorage } from 'src/shared/hooks/useStorage';
import Switch from 'src/sidebar/components/Switch';
import { HintModal } from 'src/sidebar/components/HintModal';
import { t } from 'src/shared/utils/i18n';

type Props = {
    title: I18nKey;
    hint: I18nKey;
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
};

const FilterGroupHeader: FC<Props> = ({ title, hint, enabled, onToggle }) => {
    const [settings] = useStorage();
    const extensionEnabled = settings.isEnabled;

    return (
        <div className="mb-4 flex items-center justify-between gap-2">
            <div
                className={cn(
                    'mr-auto flex items-center gap-2 text-sm leading-[1.2] transition-colors',
                    {
                        'text-white-100': extensionEnabled,
                        'text-[#51515C]': !extensionEnabled,
                    }
                )}
            >
                {t(title)}
            </div>
            <HintModal title={title} hint={hint} />
            <Switch
                disabled={!extensionEnabled}
                enabled={enabled}
                setEnabled={onToggle}
            />
        </div>
    );
};

export default FilterGroupHeader;

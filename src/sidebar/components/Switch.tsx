import React, { FC } from 'react';
import { Switch as SwitchHeadless } from '@headlessui/react';
import cn from 'classnames';

interface SwitchProps {
    enabled: boolean;
    disabled?: boolean;
    setEnabled: (enabled: boolean) => void;
}

const Switch: FC<SwitchProps> = ({
    setEnabled,
    enabled: enabledProp,
    disabled,
}) => {
    const enabled = !disabled && enabledProp;
    const onChange = (value: boolean) => {
        if (!disabled) {
            setEnabled(value);
        }
    };

    return (
        <SwitchHeadless
            checked={enabled}
            onChange={onChange}
            className={cn(
                'relative inline-flex h-4 w-[30px] items-center rounded-full transition',
                disabled ? 'cursor-default' : 'cursor-pointer',
                {
                    ['bg-red-accent']: enabled,
                    ['bg-black-600']: !enabled,
                }
            )}
        >
            <span
                className={cn(
                    'inline-block size-3 rounded-full bg-white-100 transition',
                    {
                        ['translate-x-4']: enabled,
                        ['translate-x-0.5']: !enabled,
                    }
                )}
            />
        </SwitchHeadless>
    );
};

export default Switch;

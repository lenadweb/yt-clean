import React, { FC, useCallback, useMemo } from 'react';
import { Switch as SwitchHeadless } from '@headlessui/react';
import cn from 'classnames';

interface ISwitch {
    enabled: boolean;
    disabled?: boolean;
    setEnabled: (enabled: boolean) => void;
}

const Switch: FC<ISwitch> = ({
    setEnabled,
    enabled: enabledProp,
    disabled,
}) => {
    const onChange = useCallback(
        (value: boolean) => {
            if (!disabled) {
                setEnabled(value);
            }
        },
        [disabled, setEnabled]
    );
    const enabled = useMemo(
        () => (disabled ? false : enabledProp),
        [enabledProp, disabled]
    );
    return (
        <SwitchHeadless
            checked={enabled}
            onChange={onChange}
            className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition',
                {
                    ['bg-red-accent']: enabled,
                    ['bg-black-600']: !enabled,
                }
            )}
        >
            <span
                className={cn(
                    'inline-block size-4 rounded-full bg-white-100 transition',
                    {
                        ['translate-x-6']: enabled,
                        ['translate-x-1']: !enabled,
                    }
                )}
            />
        </SwitchHeadless>
    );
};

export default Switch;

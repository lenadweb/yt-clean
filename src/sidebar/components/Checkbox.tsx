import React, { FC, useCallback } from 'react';
import { Checkbox as HeadlessCheckbox, Field, Label } from '@headlessui/react';
import cn from 'classnames';
import { NewBadge } from 'src/sidebar/components/NewBadge';
import CheckIcon from 'src/assets/icons/check.svg';

type Props = {
    label: string;
    checked: boolean;
    disabled: boolean;
    isGrey?: boolean;
    isNew?: boolean;
    onChange: (value: boolean) => void;
};

export const Checkbox: FC<Props> = ({
    label,
    checked,
    isGrey,
    isNew,
    onChange: onChangeProp,
    disabled,
}) => {
    const onChange = useCallback(
        (value: boolean) => {
            if (!disabled) {
                onChangeProp(value);
            }
        },
        [disabled]
    );
    return (
        <Field className="flex gap-2">
            <HeadlessCheckbox
                disabled={disabled}
                checked={checked}
                onChange={onChange}
                className={cn(
                    'group flex size-5 shrink-0 items-center justify-center rounded-[7px] border border-red-accent transition-colors  data-[checked]:bg-red-600',
                    {
                        ['!border-black-600']: isGrey || disabled,
                        ['!bg-black-600']: checked && (isGrey || disabled),
                    }
                )}
            >
                <CheckIcon
                    className={cn(
                        'stroke-white opacity-0 group-data-[checked]:opacity-100',
                        {
                            ['stroke-black-400']: isGrey || disabled,
                        }
                    )}
                    width="10"
                    height="7"
                />
            </HeadlessCheckbox>
            <Label
                className={cn(
                    'flex w-full items-center gap-2 text-sm text-white font-light',
                    {
                        ['text-black-400']: disabled || isGrey,
                    }
                )}
            >
                {label}
                {isNew && <NewBadge />}
            </Label>
        </Field>
    );
};

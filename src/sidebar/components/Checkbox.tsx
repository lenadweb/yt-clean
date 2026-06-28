import React, { FC } from 'react';
import { Checkbox as HeadlessCheckbox, Field, Label } from '@headlessui/react';
import cn from 'classnames';
import { NewBadge } from 'src/sidebar/components/NewBadge';
import { ExperimentalBadge } from 'src/sidebar/components/ExperimentalBadge';
import CheckIcon from 'src/assets/icons/check.svg';

type Props = {
    label: string;
    checked: boolean;
    disabled: boolean;
    isGrey?: boolean;
    isNew?: boolean;
    isExperimental?: boolean;
    onChange: (value: boolean) => void;
};

export const Checkbox: FC<Props> = ({
    label,
    checked,
    isGrey,
    isNew,
    isExperimental,
    onChange: onChangeProp,
    disabled,
}) => {
    const onChange = (value: boolean) => {
        if (!disabled) {
            onChangeProp(value);
        }
    };

    return (
        <Field className="flex gap-2">
            <HeadlessCheckbox
                disabled={disabled}
                checked={checked}
                onChange={onChange}
                className={cn(
                    'group flex size-5 shrink-0 items-center justify-center rounded-[7px] border border-red-accent transition-colors data-[checked]:bg-red-600',
                    disabled ? 'cursor-default' : 'cursor-pointer',
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
                    disabled ? 'cursor-default' : 'cursor-pointer',
                    {
                        ['text-black-400']: disabled || isGrey,
                    }
                )}
            >
                {label}
                {isNew && <NewBadge />}
                {isExperimental && <ExperimentalBadge />}
            </Label>
        </Field>
    );
};

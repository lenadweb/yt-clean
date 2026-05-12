import React, { FC, useCallback } from 'react';
import { Checkbox as HeadlessCheckbox, Field, Label } from '@headlessui/react';
import cn from 'classnames';

type Props = {
    label: string;
    checked: boolean;
    disabled: boolean;
    isGrey?: boolean;
    onChange: (value: boolean) => void;
};

export const Checkbox: FC<Props> = ({
    label,
    checked,
    isGrey,
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
                    'group flex size-6 shrink-0 items-center justify-center rounded-full border border-red-accent transition-colors  data-[checked]:bg-red-600',
                    {
                        ['!border-black-600']: isGrey || disabled,
                        ['!bg-black-600']: checked && (isGrey || disabled),
                    }
                )}
            >
                <svg
                    className={cn(
                        'stroke-white opacity-0 group-data-[checked]:opacity-100',
                        {
                            ['stroke-black-400']: isGrey || disabled,
                        }
                    )}
                    width="10"
                    height="7"
                    viewBox="0 0 10 7"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M8.875 1.00897L4.2465 5.63747C4.15274 5.73121 4.02558 5.78387 3.893 5.78387C3.76042 5.78387 3.63326 5.73121 3.5395 5.63747L1.125 3.22297"
                        strokeWidth="0.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </HeadlessCheckbox>
            <Label
                className={cn('w-full text-sm text-white', {
                    ['text-black-400']: disabled || isGrey,
                })}
            >
                {label}
            </Label>
        </Field>
    );
};

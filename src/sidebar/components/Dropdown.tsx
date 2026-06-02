import React, { FC } from 'react';
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from '@headlessui/react';
import cn from 'classnames';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { CheckIcon } from '@heroicons/react/16/solid';

type Option = {
    label: string;
    value: string;
};

type Props = {
    label: string;
    value?: string;
    disabled: boolean;
    options: Option[];
    onChange?: (value: string) => void;
};

export const Dropdown: FC<Props> = ({
    label,
    value,
    options,
    onChange,
    disabled,
}) => {
    const selectedOption =
        options.find((o) => o.value === value)?.label || 'Choose the option';

    return (
        <div className="flex flex-col gap-1">
            {label && (
                <span
                    className={cn('text-sm', {
                        'text-black-400': disabled,
                        'text-white': !disabled,
                    })}
                >
                    {label}
                </span>
            )}
            <Listbox
                value={value || ''}
                onChange={onChange}
                disabled={disabled}
            >
                <ListboxButton
                    className={cn(
                        'relative block w-full rounded-3xl py-5 pl-5 pr-11 text-left text-sm transition-colors',
                        disabled
                            ? '!border !border-black-600 !bg-black-600 !text-black-400'
                            : 'border border-red-accent bg-transparent text-white hover:bg-red-600/20',
                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                    )}
                >
                    {selectedOption}
                    <ChevronDownIcon
                        className={cn(
                            'pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 size-5 transition-colors',
                            disabled ? 'fill-black-400' : 'fill-white/60'
                        )}
                        aria-hidden="true"
                    />
                </ListboxButton>
                <ListboxOptions
                    anchor="bottom"
                    transition
                    className={cn(
                        'w-[var(--button-width)] rounded-3xl p-5 focus:outline-none transition-colors opacity-1 !max-h-52 mt-1',
                        disabled
                            ? '!border !border-black-600 bg-[#1D1D21]'
                            : 'border border-red-accent bg-[#1D1D21]'
                    )}
                >
                    {options.map((option) => (
                        <ListboxOption
                            key={option.value}
                            value={option.value}
                            className={cn(
                                'group flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors',
                                disabled
                                    ? 'cursor-not-allowed text-black-400'
                                    : 'cursor-pointer hover:bg-red-600/20 data-[focus]:bg-red-600/20'
                            )}
                        >
                            <CheckIcon
                                className={cn(
                                    'invisible size-4 transition-all group-data-[selected]:visible',
                                    disabled ? 'fill-black-400' : 'fill-white'
                                )}
                            />
                            <div
                                className={cn('text-sm', {
                                    'text-black-400': disabled,
                                    'text-white': !disabled,
                                })}
                            >
                                {option.label}
                            </div>
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </Listbox>
        </div>
    );
};

import React, { FC } from 'react';
import { Checkbox as HeadlessCheckbox } from '@headlessui/react';

type Props = {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
};

export const Checkbox: FC<Props> = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-3">
        <HeadlessCheckbox
            checked={checked}
            onChange={onChange}
            className="group flex size-6 shrink-0 items-center justify-center rounded-full border border-red-accent transition-colors data-[checked]:bg-red-600"
        >
            <svg
                className="opacity-0 group-data-[checked]:opacity-100"
                width="10"
                height="7"
                viewBox="0 0 10 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M8.875 1.00897L4.2465 5.63747C4.15274 5.73121 4.02558 5.78387 3.893 5.78387C3.76042 5.78387 3.63326 5.73121 3.5395 5.63747L1.125 3.22297"
                    stroke="white"
                    strokeWidth="0.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </HeadlessCheckbox>
        <span className="text-sm text-white">{label}</span>
    </label>
);

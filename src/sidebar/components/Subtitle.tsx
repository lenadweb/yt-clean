import React, { FC } from 'react';
import cn from 'classnames';

type Props = {
    label: string;
    value: string;
    disabled?: boolean;
};

export const Subtitle: FC<Props> = ({ label, value, disabled }) => (
    <div className="-ml-3 flex justify-between gap-4 text-sm">
        <span
            className={cn('text-sm', {
                'text-black-400': disabled,
                'text-white': !disabled,
            })}
        >
            {label}
        </span>
        <span>{value}</span>
    </div>
);

import React, { ButtonHTMLAttributes, FC } from 'react';
import clsx from 'clsx';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: string;
};

const Button: FC<ButtonProps> = ({
    variant = 'filled',
    disabled,
    className,
    children,
    ...props
}) => (
    <button
        {...props}
        disabled={disabled}
        className={clsx(
            'flex h-[31px] w-[133px] items-center justify-center rounded-[5px] text-[12px] transition-colors duration-300',
            {
                'bg-red-600 text-white border-none hover:bg-red-accent':
                    variant === 'filled' && !disabled,
                'border border-black50 bg-transparent text-black hover:border-black20 hover:bg-black-600':
                    variant === 'outlined' && !disabled,
                'opacity-60 cursor-not-allowed': disabled,
                'cursor-pointer': !disabled,
            },
            className
        )}
    >
        {children}
    </button>
);

export default Button;

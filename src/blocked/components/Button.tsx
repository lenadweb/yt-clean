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
            'flex items-center justify-center rounded-lg px-6 py-3 text-xs font-medium transition-colors duration-300',
            {
                'bg-red-600 text-white border-none hover:bg-red-accent':
                    variant === 'filled' && !disabled,
                'border border-black50 bg-transparent text-white border-red-accent hover:bg-red-600':
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

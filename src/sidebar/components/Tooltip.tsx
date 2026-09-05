import React, { FC, ReactNode } from 'react';

type Props = {
    children: ReactNode;
    label: string;
};

const Tooltip: FC<Props> = ({ children, label }) => (
    <div className="group relative flex">
        {children}
        <span
            role="tooltip"
            className="pointer-events-none absolute top-full right-0 z-20 mt-1.5 translate-y-1 whitespace-nowrap rounded-lg bg-black-600 px-2 py-1 text-[10px] text-white-100 opacity-0 shadow-3xl transition duration-150 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
        >
            {label}
        </span>
    </div>
);

export default Tooltip;

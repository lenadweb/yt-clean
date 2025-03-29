import React, { FC } from 'react';

const Divider: FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`my-5 h-px w-full bg-black-600 ${className}`} />
);

export default Divider;

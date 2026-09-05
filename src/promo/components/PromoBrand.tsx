import React, { FC } from 'react';
import Logo from '@assets/icons/logo.svg';

type Props = {
    className?: string;
};

const PromoBrand: FC<Props> = ({ className }) => (
    <div className={['promo-brand', className].filter(Boolean).join(' ')}>
        <Logo />
        <span>YouTube Clean</span>
    </div>
);

export default PromoBrand;

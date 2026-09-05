import React, { FC } from 'react';

type Props = {
    grid?: boolean;
};

const Backdrop: FC<Props> = ({ grid = true }) => (
    <div className="promo-backdrop">
        {grid && <div className="promo-backdrop__grid" />}
    </div>
);

export default Backdrop;

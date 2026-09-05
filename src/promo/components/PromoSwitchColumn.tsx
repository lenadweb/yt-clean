import React, { FC } from 'react';

type Props = {
    labels: string[];
};

const PromoSwitchColumn: FC<Props> = ({ labels }) => (
    <div className="promo-switch-column">
        <svg
            className="promo-switch-column__arrow"
            viewBox="0 0 48 32"
            aria-hidden="true"
        >
            <path d="M5 16h34M30 7l9 9-9 9" />
        </svg>
        {labels.map((label) => (
            <div className="promo-switch-column__item" key={label}>
                <span className="promo-switch-column__toggle">
                    <i />
                </span>
                <span>{label}</span>
            </div>
        ))}
    </div>
);

export default PromoSwitchColumn;

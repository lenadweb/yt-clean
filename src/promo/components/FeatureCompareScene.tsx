import React, { FC, ReactNode } from 'react';
import cn from 'classnames';
import Backdrop from 'src/promo/components/Backdrop';
import PromoBrand from 'src/promo/components/PromoBrand';
import PromoSwitchColumn from 'src/promo/components/PromoSwitchColumn';

type Props = {
    title: ReactNode;
    subtitle: string;
    switches: string[];
    before: ReactNode;
    after: ReactNode;
    compact?: boolean;
    aligned?: boolean;
};

const FeatureCompareScene: FC<Props> = ({
    title,
    subtitle,
    switches,
    before,
    after,
    compact = false,
    aligned = false,
}) => (
    <>
        <Backdrop />

        <div
            className={cn(
                'feature-compare',
                compact && 'feature-compare--compact',
                aligned && 'feature-compare--aligned'
            )}
        >
            <header className="feature-compare__header">
                <div>
                    <h2 className="feature-compare__title">{title}</h2>
                    <p className="feature-compare__subtitle">{subtitle}</p>
                </div>

                <PromoBrand />
            </header>

            <div className="feature-compare__comparison">
                <div className="feature-compare__window feature-compare__window--before">
                    {before}
                </div>

                <PromoSwitchColumn labels={switches} />

                <div className="feature-compare__window feature-compare__window--after">
                    {after}
                </div>
            </div>
        </div>
    </>
);

export default FeatureCompareScene;

import React from 'react';
import Backdrop from 'src/promo/components/Backdrop';
import PromoBrand from 'src/promo/components/PromoBrand';
import PromoSwitchColumn from 'src/promo/components/PromoSwitchColumn';
import YouTubeMock from 'src/promo/components/YouTubeMock';

const FreshScene = () => (
    <>
        <Backdrop />

        <div className="fresh">
            <header className="fresh__header">
                <div>
                    <h2 className="fresh__title">
                        Already watched? <strong>Already gone.</strong>
                    </h2>
                    <p className="fresh__subtitle">
                        Hide watched videos and make room for something new.
                    </p>
                </div>

                <PromoBrand />
            </header>

            <div className="fresh__comparison">
                <section className="fresh__side fresh__side--before">
                    <div className="fresh__window">
                        <YouTubeMock variant="watched" />
                    </div>
                </section>

                <PromoSwitchColumn labels={['Hide watched']} />

                <section className="fresh__side fresh__side--after">
                    <div className="fresh__window fresh__window--after">
                        <YouTubeMock variant="fresh" />
                    </div>
                </section>
            </div>
        </div>
    </>
);

export default FreshScene;

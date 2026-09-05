import React from 'react';
import Backdrop from 'src/promo/components/Backdrop';
import PromoBrand from 'src/promo/components/PromoBrand';
import PromoSwitchColumn from 'src/promo/components/PromoSwitchColumn';
import YouTubeMock from 'src/promo/components/YouTubeMock';

const BeforeAfterScene = () => (
    <>
        <Backdrop />

        <div className="ba">
            <header className="ba__header">
                <div>
                    <h2 className="ba__title">
                        Same YouTube. <strong>Zero noise.</strong>
                    </h2>
                    <p className="ba__subtitle">
                        Hide Shorts, sponsored videos, mixes, and more.
                    </p>
                </div>

                <div className="ba__aside">
                    <PromoBrand />
                    <div className="ba__catalog">
                        <span>Feed controls</span>
                        <b>Shorts</b>
                        <i />
                        <b>Sponsored</b>
                        <i />
                        <b>Mixes</b>
                    </div>
                </div>
            </header>

            <div className="ba__split">
                <div className="ba__side">
                    <div className="ba__window ba__window--before">
                        <YouTubeMock variant="before" />
                    </div>
                </div>

                <PromoSwitchColumn
                    labels={['Hide Shorts', 'Hide Sponsored', 'Hide Mixes']}
                />

                <div className="ba__side">
                    <div className="ba__window ba__window--after">
                        <YouTubeMock variant="after" />
                    </div>
                </div>
            </div>
        </div>
    </>
);

export default BeforeAfterScene;

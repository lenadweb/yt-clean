import React from 'react';
import Backdrop from 'src/promo/components/Backdrop';
import YouTubeMock from 'src/promo/components/YouTubeMock';

const BeforeAfterScene = () => (
    <>
        <Backdrop />

        <div className="ba">
            <header className="ba__header">
                <h2 className="ba__title">
                    Same YouTube. <strong>Zero noise.</strong>
                </h2>
                <p className="ba__subtitle">
                    One toggle strips Shorts, ads, mixes and everything else you
                    never asked for.
                </p>
            </header>

            <div className="ba__split">
                <div className="ba__side">
                    <div className="ba__label">
                        <span className="ba__label-key">Before</span>
                        <span className="ba__label-note">
                            endless Shorts, ads, mixes
                        </span>
                    </div>
                    <div className="ba__window ba__window--before">
                        <YouTubeMock variant="before" />
                    </div>
                </div>

                <div className="ba__side">
                    <div className="ba__label ba__label--after">
                        <span className="ba__label-key">After</span>
                        <span className="ba__label-note">
                            only the videos you chose
                        </span>
                    </div>
                    <div className="ba__window ba__window--after">
                        <YouTubeMock variant="after" />
                    </div>
                </div>
            </div>
        </div>
    </>
);

export default BeforeAfterScene;

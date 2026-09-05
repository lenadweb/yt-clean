import React from 'react';
import Logo from '@assets/icons/logo.svg';
import Backdrop from 'src/promo/components/Backdrop';
import SettingsStage from 'src/promo/components/SettingsStage';

const FOOTER = ['No account', 'No tracking', 'No data collection', 'Free'];

const PowerScene = () => (
    <>
        <Backdrop />

        <div className="power">
            <header className="power__header">
                <div className="power__brand">
                    <Logo />
                    <span>YouTube Clean</span>
                </div>
                <h2 className="power__title">
                    60+ toggles. <strong>One panel.</strong>
                </h2>
                <p className="power__subtitle">
                    Flip what bothers you, keep what you love. Every change
                    applies instantly.
                </p>
            </header>

            <SettingsStage />

            <footer className="power__footer">
                {FOOTER.map((item) => (
                    <span key={item} className="promo-pill">
                        {item}
                    </span>
                ))}
                <span className="promo-pill promo-pill--red">
                    <span className="promo-pill__code">&lt;/&gt;</span>
                    OPEN SOURCE
                </span>
            </footer>
        </div>
    </>
);

export default PowerScene;

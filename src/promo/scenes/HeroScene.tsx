import React from 'react';
import Logo from '@assets/icons/logo.svg';
import SidebarPanel from 'src/promo/components/SidebarPanel';
import Backdrop from 'src/promo/components/Backdrop';

const HeroScene = () => (
    <>
        <Backdrop />

        <div className="hero__content">
            <Logo className="hero__logo" />

            <h1 className="hero__title">
                YouTube <strong>Clean</strong>
            </h1>
            <p className="hero__tagline">Less noise. More YouTube.</p>

            <div className="hero__pills">
                <span className="promo-pill promo-pill--red">
                    <span className="promo-pill__code">&lt;/&gt;</span>
                    OPEN SOURCE
                </span>
                <span className="promo-pill">60+ toggles</span>
                <span className="promo-pill">No tracking</span>
            </div>
        </div>

        <SidebarPanel
            bleed
            height={620}
            scale={1.3}
            style={{ position: 'absolute', top: 72, right: 68, zIndex: 3 }}
        />
    </>
);

export default HeroScene;

import React from 'react';
import Logo from '@assets/icons/logo.svg';
import SidebarPanel from 'src/promo/components/SidebarPanel';
import Backdrop from 'src/promo/components/Backdrop';

const HeroScene = () => (
    <>
        <Backdrop />
        <div className="hero__surface" />

        <div className="hero__content">
            <Logo className="hero__logo" />

            <h1 className="hero__title">
                YouTube <strong>Clean</strong>
            </h1>
            <p className="hero__tagline">Less noise. More YouTube.</p>
        </div>

        <div className="hero__facts">
            <span>70+ controls</span>
            <i />
            <span>No tracking</span>
            <i />
            <span>Open source</span>
        </div>

        <SidebarPanel
            className="hero__panel"
            bleed
            height={620}
            scale={1.3}
            style={{ position: 'absolute', top: 54, right: 48, zIndex: 3 }}
        />
    </>
);

export default HeroScene;

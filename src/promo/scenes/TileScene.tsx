import React from 'react';
import Logo from '@assets/icons/logo.svg';
import Backdrop from 'src/promo/components/Backdrop';
import SidebarPanel from 'src/promo/components/SidebarPanel';

const TileScene = () => (
    <>
        <Backdrop />

        <div className="tile__content">
            <Logo className="tile__logo" />

            <h1 className="tile__title">
                YouTube <strong>Clean</strong>
            </h1>
            <p className="tile__tagline">Less noise. More YouTube.</p>

            <div className="tile__facts">
                <span>70+ controls</span>
                <i />
                <span>No tracking</span>
            </div>
        </div>

        <SidebarPanel
            className="tile__panel"
            bleed
            dense
            height={580}
            scale={0.5}
            style={{ position: 'absolute', top: 12, right: 14, zIndex: 3 }}
        />
    </>
);

export default TileScene;

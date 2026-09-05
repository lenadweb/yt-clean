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

            <span className="tile__badge">
                <span className="promo-pill__code">&lt;/&gt;</span>
                OPEN SOURCE
            </span>
        </div>

        <SidebarPanel
            bleed
            dense
            height={580}
            scale={0.5}
            style={{ position: 'absolute', top: 12, right: 22, zIndex: 3 }}
        />
    </>
);

export default TileScene;

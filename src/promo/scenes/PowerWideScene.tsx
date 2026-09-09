import React from 'react';
import Backdrop from 'src/promo/components/Backdrop';
import PromoBrand from 'src/promo/components/PromoBrand';
import SettingsStage from 'src/promo/components/SettingsStage';

const FACTS = ['No account', 'No tracking', 'Data stays local', 'Open source'];

const PowerWideScene = () => (
    <>
        <Backdrop />

        <div className="power-wide">
            <section className="power-wide__intro">
                <PromoBrand />

                <div className="power-wide__copy">
                    <h1 className="power-wide__title">
                        70+ controls.
                        <br />
                        <strong>One panel.</strong>
                    </h1>
                    <p className="power-wide__subtitle">
                        Keep what you love about YouTube. Hide everything else
                        in seconds.
                    </p>
                </div>

                <footer className="power-wide__facts">
                    {FACTS.map((item) => (
                        <span key={item}>{item}</span>
                    ))}
                </footer>
            </section>

            <div className="power-wide__stage">
                <SettingsStage />
            </div>
        </div>
    </>
);

export default PowerWideScene;

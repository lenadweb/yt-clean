import React from 'react';
import Backdrop from 'src/promo/components/Backdrop';
import PromoBrand from 'src/promo/components/PromoBrand';
import SettingsStage from 'src/promo/components/SettingsStage';

const FOOTER = ['No account', 'No tracking', 'Data stays local', 'Open source'];

const PowerScene = () => (
    <>
        <Backdrop />

        <div className="power">
            <header className="power__header">
                <div>
                    <h2 className="power__title">
                        70+ controls. <strong>One panel.</strong>
                    </h2>
                    <p className="power__subtitle">
                        Flip what bothers you, keep what you love. Every change
                        applies instantly.
                    </p>
                </div>

                <PromoBrand />
            </header>

            <SettingsStage />

            <footer className="power__footer">
                {FOOTER.map((item, index) => (
                    <React.Fragment key={item}>
                        {index > 0 && <i />}
                        <span>{item}</span>
                    </React.Fragment>
                ))}
            </footer>
        </div>
    </>
);

export default PowerScene;

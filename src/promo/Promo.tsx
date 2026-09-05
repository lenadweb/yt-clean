import React from 'react';
import Logo from '@assets/icons/logo.svg';
import App, { SidebarMock } from 'src/sidebar/App';
import { DEFAULT_STORAGE } from 'src/shared/storage/config';
import englishMessages from 'src/_locales/en/messages.json';

const sidebarMock: SidebarMock = {
    hideShortcut: true,
    hideFooter: true,
    messages: englishMessages,
    settings: {
        ...DEFAULT_STORAGE,
        activePreset: 'custom',
        presetWarningDismissed: true,
        voiceButtonInSearch: { enabled: true },
        virtualKeyboard: { enabled: true },
        hideSearchTags: { enabled: true },
        hideCreateVideo: { enabled: true },
        notificationButton: { enabled: true },
    },
};

const Promo = () => (
    <main className="promo-canvas">
        <section className="promo-hero">
            <Logo className="promo-hero-logo" />

            <h1>
                <span>YouTube </span>
                <strong>Clean</strong>
            </h1>
            <p className="promo-tagline">Less noise. More YouTube.</p>

            <div className="promo-open-source">
                <span className="promo-code-icon">&lt;/&gt;</span>
                <span>OPEN SOURCE</span>
            </div>

            <div className="promo-benefits">
                <span>Hide distractions</span>
                <i />
                <span>Customize your layout</span>
                <i />
                <span>Stay focused</span>
            </div>
        </section>

        <div className="promo-sidebar-stage">
            <div className="promo-sidebar-scale">
                <App mock={sidebarMock} />
            </div>
        </div>
    </main>
);

export default Promo;

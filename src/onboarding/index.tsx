import React from 'react';
import ReactDOM from 'react-dom/client';
import Logo from 'src/assets/icons/logo.svg';
import { t } from 'src/shared/utils/i18n';
import '@assets/styles/index.css';
import './onboarding.css';

const YOUTUBE_URL = 'https://www.youtube.com/';

const ArrowIcon = () => (
    <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-5 fill-none stroke-current stroke-2"
    >
        <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
);

const LoaderIcon = () => (
    <span className="onboarding-loader" aria-hidden="true" />
);

const Preview = () => (
    <div className="preview-shell" aria-hidden="true">
        <div className="preview-toolbar">
            <div className="preview-menu" />
            <div className="preview-youtube-mark">
                <div className="preview-play" />
            </div>
            <div className="preview-search" />
            <div className="preview-avatar" />
        </div>
        <div className="preview-body">
            <div className="preview-navigation">
                {Array.from({ length: 5 }, (_, index) => (
                    <div className="preview-nav-item" key={index} />
                ))}
            </div>
            <div className="preview-feed">
                <div className="preview-chips">
                    {Array.from({ length: 4 }, (_, index) => (
                        <div className="preview-chip" key={index} />
                    ))}
                </div>
                <div className="preview-grid">
                    {Array.from({ length: 6 }, (_, index) => (
                        <div className="preview-video" key={index}>
                            <div className="preview-thumbnail">
                                <span>{index % 2 ? '12:08' : '8:42'}</span>
                            </div>
                            <div className="preview-meta">
                                <div className="preview-channel" />
                                <div className="preview-lines">
                                    <div className="preview-line" />
                                    <div className="preview-line preview-line-short" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const App = () => {
    const [isLoading, setIsLoading] = React.useState(false);

    const openYoutube = () => {
        if (isLoading) return;
        setIsLoading(true);

        if (chrome.sidePanel) {
            void chrome.sidePanel
                .open({ windowId: chrome.windows.WINDOW_ID_CURRENT })
                .catch((error) => console.error(error));
        }

        window.setTimeout(() => {
            void chrome.tabs.update({ url: YOUTUBE_URL }).catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
        }, 450);
    };

    return (
        <main className="onboarding-page">
            <section className="onboarding-panel">
                <div className="onboarding-brand">
                    <Logo className="size-12 sm:size-14" />
                    <span>{t('youtube_clean')}</span>
                </div>

                <div className="onboarding-content">
                    <div className="onboarding-copy">
                        <h1>{t('onboarding_title')}</h1>

                        <button
                            type="button"
                            onClick={openYoutube}
                            disabled={isLoading}
                            aria-busy={isLoading}
                            className="onboarding-button"
                        >
                            {t('customize_youtube')}
                            {isLoading ? <LoaderIcon /> : <ArrowIcon />}
                        </button>
                    </div>

                    <Preview />
                </div>
            </section>
        </main>
    );
};

const language = chrome.i18n.getUILanguage().replace('_', '-');
const isRtl = ['ar', 'fa', 'he'].includes(language.split('-')[0]);
document.documentElement.lang = language;
document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
document.title = t('youtube_clean');

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

ReactDOM.createRoot(root).render(<App />);

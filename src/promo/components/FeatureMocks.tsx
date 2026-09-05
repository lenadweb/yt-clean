import React, { FC } from 'react';
import cn from 'classnames';
import { YouTubeTopBar } from 'src/promo/components/YouTubeMock';

const Lines: FC<{ widths?: string[] }> = ({
    widths = ['92%', '68%', '48%'],
}) => (
    <span className="feature-lines">
        {widths.map((width, index) => (
            <i key={`${width}-${index}`} style={{ width }} />
        ))}
    </span>
);

const MiniVideo: FC<{ seed: number }> = ({ seed }) => {
    const widths = [
        ['88%', '56%'],
        ['96%', '67%'],
        ['78%', '48%'],
    ][seed % 3];

    return (
        <div className="feature-video">
            <span className="feature-video__thumb" />
            <Lines widths={widths} />
        </div>
    );
};

const Comment = () => (
    <div className="watch-mock__comment">
        <span />
        <Lines widths={['92%', '68%']} />
    </div>
);

export const WatchPageMock: FC<{ clean?: boolean }> = ({ clean = false }) => (
    <div className={cn('yt feature-mock watch-mock', clean && 'is-clean')}>
        <YouTubeTopBar />
        <div className="watch-mock__layout">
            <main className="watch-mock__main">
                <div className="watch-mock__player">
                    <span className="watch-mock__play" />
                    <span className="watch-mock__timeline">
                        <i />
                    </span>
                    <span className="watch-mock__controls" />
                </div>

                <Lines widths={['94%', '58%']} />

                <div className="watch-mock__meta">
                    <span className="watch-mock__avatar" />
                    <Lines widths={['82%', '52%']} />
                    <b>Subscribe</b>
                    {!clean && (
                        <div className="watch-mock__actions mock-removable">
                            <span>Like</span>
                            <span>Share</span>
                            <span>Save</span>
                        </div>
                    )}
                </div>

                <div className="watch-mock__description">
                    <Lines widths={['98%', '88%', '64%']} />
                </div>

                {!clean && (
                    <div className="watch-mock__comments mock-removable">
                        <b>Comments</b>
                        <Comment />
                        <Comment />
                    </div>
                )}
            </main>

            <aside
                className={cn('watch-mock__aside', !clean && 'mock-removable')}
            >
                {clean ? (
                    <>
                        <MiniVideo seed={0} />
                        <MiniVideo seed={1} />
                        <MiniVideo seed={2} />
                    </>
                ) : (
                    <>
                        <b>Live chat</b>
                        {Array.from({ length: 7 }, (_, index) => (
                            <div className="watch-mock__chat" key={index}>
                                <span />
                                <Lines
                                    widths={
                                        index % 2
                                            ? ['76%', '48%']
                                            : ['88%', '61%']
                                    }
                                />
                            </div>
                        ))}
                    </>
                )}
            </aside>
        </div>
    </div>
);

type NavIconName =
    | 'home'
    | 'shorts'
    | 'subscriptions'
    | 'trending'
    | 'music'
    | 'live'
    | 'gaming'
    | 'history'
    | 'playlists'
    | 'watchLater';

interface NavItem {
    icon: NavIconName;
    label: string;
}

const NAV_PRIMARY: NavItem[] = [
    { icon: 'home', label: 'Home' },
    { icon: 'shorts', label: 'Shorts' },
    { icon: 'subscriptions', label: 'Subscriptions' },
];

const NAV_EXPLORE: NavItem[] = [
    { icon: 'trending', label: 'Trending' },
    { icon: 'music', label: 'Music' },
    { icon: 'live', label: 'Live' },
    { icon: 'gaming', label: 'Gaming' },
];

const NAV_YOU: NavItem[] = [
    { icon: 'history', label: 'History' },
    { icon: 'playlists', label: 'Playlists' },
    { icon: 'watchLater', label: 'Watch later' },
];

// Self-hosted vector paths from Google Material Symbols; Shorts uses its
// dedicated YouTube mark so the mock remains recognizable without network I/O.
const MATERIAL_PATHS: Record<Exclude<NavIconName, 'shorts'>, string> = {
    home: 'M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z',
    subscriptions:
        'M160-80q-33 0-56.5-23.5T80-160v-400q0-33 23.5-56.5T160-640h640q33 0 56.5 23.5T880-560v400q0 33-23.5 56.5T800-80H160Zm0-80h640v-400H160v400Zm240-40 240-160-240-160v320ZM160-680v-80h640v80H160Zm120-120v-80h400v80H280ZM160-160v-400 400Z',
    trending:
        'M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z',
    music: 'M287-167q-47-47-47-113t47-113q47-47 113-47 23 0 42.5 5.5T480-418v-422h240v160H560v400q0 66-47 113t-113 47q-66 0-113-47Z',
    live: 'M197-197q-54-55-85.5-127.5T80-480q0-84 31.5-156.5T197-763l57 57q-44 44-69 102t-25 124q0 67 25 125t69 101l-57 57Zm113-113q-32-33-51-76.5T240-480q0-51 19-94.5t51-75.5l57 57q-22 22-34.5 51T320-480q0 33 12.5 62t34.5 51l-57 57Zm113.5-113.5Q400-447 400-480t23.5-56.5Q447-560 480-560t56.5 23.5Q560-513 560-480t-23.5 56.5Q513-400 480-400t-56.5-23.5ZM650-310l-57-57q22-22 34.5-51t12.5-62q0-33-12.5-62T593-593l57-57q32 32 51 75.5t19 94.5q0 50-19 93.5T650-310Zm113 113-57-57q44-44 69-102t25-124q0-67-25-125t-69-101l57-57q54 54 85.5 126.5T880-480q0 83-31.5 155.5T763-197Z',
    gaming: 'M182-200q-51 0-79-35.5T82-322l42-300q9-60 53.5-99T282-760h396q60 0 104.5 39t53.5 99l42 300q7 51-21 86.5T778-200q-21 0-39-7.5T706-230l-90-90H344l-90 90q-15 15-33 22.5t-39 7.5Zm16-86 114-114h336l114 114q2 2 16 6 11 0 17.5-6.5T800-304l-44-308q-4-29-26-48.5T678-680H282q-30 0-52 19.5T204-612l-44 308q-2 11 4.5 17.5T182-280q2 0 16-6Zm510.5-165.5Q720-463 720-480t-11.5-28.5Q697-520 680-520t-28.5 11.5Q640-497 640-480t11.5 28.5Q663-440 680-440t28.5-11.5Zm-80-120Q640-583 640-600t-11.5-28.5Q617-640 600-640t-28.5 11.5Q560-617 560-600t11.5 28.5Q583-560 600-560t28.5-11.5ZM310-440h60v-70h70v-60h-70v-70h-60v70h-70v60h70v70Zm170-40Z',
    history:
        'M480-120q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z',
    playlists:
        'M120-320v-80h320v80H120Zm0-160v-80h480v80H120Zm0-160v-80h480v80H120Zm520 520v-320l240 160-240 160Z',
    watchLater:
        'm612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z',
};

const NavIcon: FC<{ name: NavIconName }> = ({ name }) => {
    if (name === 'shorts') {
        return (
            <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="m18.93 9.99-1.44-.6 1.72-.91a4.49 4.49 0 0 0-4.22-7.96L4.79 5.93a4.5 4.5 0 0 0 .27 8.1l1.44.6-1.71.9A4.52 4.52 0 0 0 6.93 24c.73 0 1.44-.17 2.08-.51l10.21-5.4a4.5 4.5 0 0 0-.29-8.1ZM9.6 15.19V8.82l6 3.19-6 3.18Z" />
            </svg>
        );
    }

    return (
        <svg aria-hidden="true" viewBox="0 -960 960 960">
            <path d={MATERIAL_PATHS[name]} />
        </svg>
    );
};

const NavRow: FC<{ active?: boolean; item: NavItem }> = ({
    active = false,
    item,
}) => (
    <div className={cn('nav-mock__row', active && 'nav-mock__row--active')}>
        <NavIcon name={item.icon} />
        <span>{item.label}</span>
    </div>
);

export const NavigationMock: FC<{ clean?: boolean }> = ({ clean = false }) => (
    <div className={cn('yt feature-mock nav-mock', clean && 'is-clean')}>
        <YouTubeTopBar />
        <div className="nav-mock__layout">
            <aside className="nav-mock__sidebar">
                {NAV_PRIMARY.map((item, index) => (
                    <NavRow active={index === 0} item={item} key={item.label} />
                ))}

                {!clean && (
                    <div className="nav-mock__group mock-removable">
                        {NAV_EXPLORE.map((item) => (
                            <NavRow item={item} key={item.label} />
                        ))}
                    </div>
                )}

                <div className="nav-mock__group">
                    {NAV_YOU.map((item) => (
                        <NavRow item={item} key={item.label} />
                    ))}
                </div>
            </aside>

            <main className="nav-mock__feed">
                <div className="nav-mock__chips">
                    <span>All</span>
                    <span>Gaming</span>
                    <span>Music</span>
                </div>
                <div className="nav-mock__grid">
                    {Array.from({ length: 6 }, (_, index) => (
                        <div className="nav-mock__video" key={index}>
                            <span />
                            <Lines
                                widths={
                                    index % 2
                                        ? ['92%', '61%', '42%']
                                        : ['82%', '54%', '36%']
                                }
                            />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    </div>
);

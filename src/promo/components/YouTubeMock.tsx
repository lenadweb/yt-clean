import React, { FC, ReactNode } from 'react';
import cn from 'classnames';

const TONES = [
    'linear-gradient(140deg, #2f4a6b, #12202f)',
    'linear-gradient(140deg, #5a2f36, #1d1214)',
    'linear-gradient(140deg, #3b4a2e, #161d13)',
    'linear-gradient(140deg, #46375f, #1a1424)',
    'linear-gradient(140deg, #6b5330, #241a10)',
    'linear-gradient(140deg, #2c5350, #12211f)',
    'linear-gradient(140deg, #4a3355, #1b1322)',
    'linear-gradient(140deg, #5b3b2b, #201310)',
    'linear-gradient(140deg, #33415e, #141a26)',
];

const ICONS: Record<string, ReactNode> = {
    home: <path d="M3 10.4 12 3l9 7.4V21h-6.4v-6.1H9.4V21H3z" />,
    shorts: (
        <>
            <rect x="5.5" y="2.5" width="13" height="19" rx="6.5" />
            <path d="M10.6 8.6 15 12l-4.4 3.4z" />
        </>
    ),
    subscriptions: (
        <>
            <path d="M6.5 3.5h11M4 7h16" />
            <rect x="3" y="10" width="18" height="10.5" rx="2" />
        </>
    ),
    you: (
        <>
            <circle cx="12" cy="8" r="4" />
            <path d="M4.5 20.5c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7" />
        </>
    ),
    bell: (
        <path d="M6 17.5v-5.6a6 6 0 0 1 12 0v5.6l1.5 1.6H4.5zM10 20.5a2 2 0 0 0 4 0" />
    ),
    search: (
        <>
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="M15.5 15.5 21 21" />
        </>
    ),
    mic: (
        <>
            <rect x="9" y="2.5" width="6" height="11" rx="3" />
            <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3.5" />
        </>
    ),
    plus: <path d="M12 5.5v13M5.5 12h13" />,
    dots: (
        <>
            <circle cx="12" cy="5" r="1.6" />
            <circle cx="12" cy="12" r="1.6" />
            <circle cx="12" cy="19" r="1.6" />
        </>
    ),
};

type IconProps = {
    name: keyof typeof ICONS | string;
    size: number;
    className?: string;
};

const Icon: FC<IconProps> = ({ name, size, className }) => (
    <svg
        className={cn('yt-icon', className)}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {ICONS[name]}
    </svg>
);

const Junk: FC<{ tag: string; children: ReactNode }> = ({ tag, children }) => (
    <div className="yt-junk">
        <span className="yt-junk__tag">{tag}</span>
        {children}
    </div>
);

const WIDTHS: [string, string, string, string][] = [
    ['96%', '54%', '44%', '62%'],
    ['88%', '68%', '38%', '54%'],
    ['92%', '46%', '52%', '58%'],
    ['100%', '61%', '41%', '66%'],
    ['84%', '72%', '48%', '50%'],
    ['94%', '58%', '36%', '60%'],
];

type SkeletonProps = {
    seed: number;
};

const Skeleton: FC<SkeletonProps> = ({ seed }) => {
    const [first, second, channel, meta] = WIDTHS[seed % WIDTHS.length];

    return (
        <span className="yt-card__text">
            <span className="yt-card__title">
                <i style={{ width: first }} />
                <i style={{ width: second }} />
            </span>
            <span className="yt-card__channel" style={{ width: channel }} />
            <span className="yt-card__meta" style={{ width: meta }} />
        </span>
    );
};

type CardProps = {
    tone: number;
    seed: number;
    badge?: string;
    live?: boolean;
};

const Card: FC<CardProps> = ({ tone, seed, badge, live }) => (
    <div className="yt-card">
        <div className="yt-card__thumb" style={{ background: TONES[tone] }}>
            {badge && (
                <span className={cn('yt-card__badge', live && 'is-live')}>
                    {badge}
                </span>
            )}
        </div>
        <div className="yt-card__row">
            <span className="yt-card__avatar" />
            <Skeleton seed={seed} />
            <Icon name="dots" size={11} className="yt-card__dots" />
        </div>
    </div>
);

const TopBar = () => (
    <div className="yt-top">
        <span className="yt-burger" />
        <span className="yt-brand">
            <span className="yt-brand__mark" />
            YouTube
        </span>
        <span className="yt-search">
            <span className="yt-search__field">Search</span>
            <span className="yt-search__go">
                <Icon name="search" size={12} />
            </span>
        </span>
        <span className="yt-round">
            <Icon name="mic" size={12} />
        </span>
        <span className="yt-create">
            <Icon name="plus" size={11} />
            Create
        </span>
        <span className="yt-bell">
            <Icon name="bell" size={13} />
        </span>
        <span className="yt-me" />
    </div>
);

const RAIL = ['home', 'shorts', 'subscriptions', 'you'];
const RAIL_LABELS: Record<string, string> = {
    home: 'Home',
    shorts: 'Shorts',
    subscriptions: 'Subscriptions',
    you: 'You',
};

const CHIPS = [
    'All',
    'Gaming',
    'Music',
    'Live',
    'Esports',
    'Podcasts',
    'News',
    'Mixes',
];

const Rail: FC<{ items: string[] }> = ({ items }) => (
    <div className="yt-rail">
        {items.map((item, index) => (
            <div
                key={item}
                className={cn('yt-rail__item', index === 0 && 'is-active')}
            >
                <Icon name={item} size={17} />
                {RAIL_LABELS[item]}
            </div>
        ))}
    </div>
);

const Chips: FC<{ items: string[] }> = ({ items }) => (
    <div className="yt-chips">
        {items.map((chip, index) => (
            <span
                key={chip}
                className={cn('yt-chip', index === 0 && 'is-active')}
            >
                {chip}
            </span>
        ))}
    </div>
);

const YouTubeMock: FC<{ variant: 'before' | 'after' }> = ({ variant }) => {
    const isBefore = variant === 'before';

    return (
        <div className={cn('yt', `yt--${variant}`)}>
            <TopBar />
            <div className="yt-body">
                <Rail
                    items={
                        isBefore
                            ? RAIL
                            : RAIL.filter((item) => item !== 'shorts')
                    }
                />

                <div className="yt-feed">
                    <Chips items={isBefore ? CHIPS : CHIPS.slice(0, 3)} />

                    {isBefore ? (
                        <>
                            <Junk tag="Sponsored">
                                <div className="yt-ad">
                                    <div className="yt-ad__thumb" />
                                    <div className="yt-ad__body">
                                        <span className="yt-card__title">
                                            <i style={{ width: '92%' }} />
                                            <i style={{ width: '58%' }} />
                                        </span>
                                        <span
                                            className="yt-ad__label"
                                            style={{ width: '38%' }}
                                        />
                                        <span className="yt-ad__actions">
                                            <i>Watch</i>
                                            <i className="is-primary">
                                                Subscribe
                                            </i>
                                        </span>
                                    </div>
                                </div>
                            </Junk>

                            <Junk tag="Shorts">
                                <div className="yt-shelf">
                                    <div className="yt-shelf__head">
                                        <span className="yt-shelf__mark" />
                                        Shorts
                                    </div>
                                    <div className="yt-shelf__row">
                                        {[1, 4, 7, 3, 5].map((tone, index) => (
                                            <span
                                                key={index}
                                                className="yt-short"
                                                style={{
                                                    background: TONES[tone],
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </Junk>

                            <div className="yt-grid">
                                <Card tone={0} seed={0} badge="3:01:00" />
                                <Card tone={1} seed={1} badge="LIVE" live />
                            </div>

                            <Junk tag="Mixes & watched">
                                <div className="yt-grid">
                                    <Card tone={6} seed={2} badge="Mix" />
                                    <Card tone={4} seed={3} badge="24:38" />
                                </div>
                            </Junk>
                        </>
                    ) : (
                        <div className="yt-grid">
                            <Card tone={0} seed={0} badge="3:01:00" />
                            <Card tone={1} seed={1} badge="LIVE" live />
                            <Card tone={2} seed={2} badge="18:12" />
                            <Card tone={8} seed={3} badge="1:31:49" />
                            <Card tone={5} seed={4} badge="11:22" />
                            <Card tone={3} seed={5} badge="9:41" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default YouTubeMock;

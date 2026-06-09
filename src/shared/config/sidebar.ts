import { defineCategory } from 'src/shared/featureConfig/dsl';

const sidebar = defineCategory('sidebar');

const hideSidebar = sidebar.section('hide_sidebar_completely', {
    isNew: true,
    withoutCheckboxes: true,
});
const mainMenu = sidebar.section('main_menu', {
    withoutSwitch: true,
});
const you = sidebar.section('you', {
    whenAllEnabled: {
        hide: [
            '#sections ytd-guide-collapsible-section-entry-renderer:has([href="/feed/history"])',
        ],
    },
});
const subscriptions = sidebar.section('hide_subscriptions_list', {
    withoutCheckboxes: true,
});
const explore = sidebar.section('explore', {
    whenAllEnabled: {
        hide: [
            "#sections ytd-guide-section-renderer:has([href*='feed/trending'])",
        ],
    },
});
const moreFromYoutube = sidebar.section('more_from_youtube', {
    whenAllEnabled: {
        hide: [
            "#sections ytd-guide-section-renderer:has([href='https://music.youtube.com/'])",
        ],
    },
});

export const sidebarFeatures = [
    hideSidebar.feature({
        id: 'hideSidebar',
        title: 'hide_sidebar_completely',
        hide: [
            'tp-yt-app-drawer#guide',
            'ytd-mini-guide-renderer',
            '#guide-button',
        ],
        styles: [
            `#page-manager {
                    margin-left: 12px !important;
                }`,
        ],
    }),
    mainMenu.feature({
        id: 'hideMenuShorts',
        title: 'hide_shorts',
        hide: [
            'ytd-mini-guide-entry-renderer[aria-label=Shorts]',
            '#sections #items > ytd-guide-entry-renderer:has([title=Shorts])',
        ],
    }),
    you.feature({
        id: 'hideMenuHistory',
        title: 'hide_history',
        hide: [
            '#section-items ytd-guide-entry-renderer:has([href="/feed/history"])',
        ],
    }),
    you.feature({
        id: 'hideMenuPlaylists',
        title: 'hide_playlists',
        hide: [
            '#section-items ytd-guide-entry-renderer:has([href="/feed/playlists"])',
        ],
    }),
    you.feature({
        id: 'hideMenuYourVideo',
        title: 'hide_your_video',
        hide: [
            '#section-items ytd-guide-entry-renderer:has([href*="studio.youtube"])',
        ],
    }),
    you.feature({
        id: 'hideMenuWatchLater',
        title: 'hide_watch_later',
        hide: [
            '#section-items ytd-guide-entry-renderer:has([href="/playlist?list=WL"])',
        ],
    }),
    you.feature({
        id: 'hideMenuLikedVideos',
        title: 'hide_liked_videos',
        hide: [
            '#section-items ytd-guide-entry-renderer:has([href="/playlist?list=LL"])',
        ],
    }),
    you.feature({
        id: 'hideYourMovies',
        title: 'your_movies',
        hide: [
            '#section-items ytd-guide-entry-renderer:has([href*="/feed/storefront"])',
        ],
    }),
    subscriptions.feature({
        id: 'hideMenuSubscriptionsList',
        title: 'hide_subscriptions_list',
        hide: [
            "#sections ytd-guide-section-renderer:has([href*='@'])",
            "ytd-mini-guide-renderer ytd-mini-guide-entry-renderer:has([href='/feed/subscriptions'])",
        ],
    }),
    explore.feature({
        id: 'hideMenuExploreTrending',
        title: 'hide_trending',
        hide: [
            "#sections ytd-guide-entry-renderer:has([href*='feed/trending'])",
        ],
    }),
    explore.feature({
        id: 'hideMenuExploreMusic',
        title: 'hide_music',
        hide: [
            "#sections ytd-guide-entry-renderer:has([href*='channel/UC-9'])",
        ],
    }),
    explore.feature({
        id: 'hideMenuExploreGaming',
        title: 'hide_gaming',
        hide: ["#sections ytd-guide-entry-renderer:has([href='/gaming'])"],
    }),
    explore.feature({
        id: 'hideMenuExploreNews',
        title: 'hide_news',
        hide: [
            "#sections ytd-guide-entry-renderer:has([href*='UCYfdidRxbB8Qhf0Nx7ioOYw'])",
        ],
    }),
    explore.feature({
        id: 'hideMenuExploreSports',
        title: 'hide_sports',
        hide: [
            "#sections ytd-guide-entry-renderer:has([href*='UCEgdi0XIXXZ-qJOFPf4JSKw'])",
        ],
    }),
    moreFromYoutube.feature({
        id: 'hideMenuMorePremium',
        title: 'hide_youtube_premium',
        hide: [
            "#sections #items ytd-guide-entry-renderer:has([href='/premium'])",
        ],
    }),
    moreFromYoutube.feature({
        id: 'hideMenuMoreMusic',
        title: 'hide_youtube_music',
        hide: [
            "#sections #items ytd-guide-entry-renderer:has([href='https://music.youtube.com/'])",
        ],
    }),
    moreFromYoutube.feature({
        id: 'hideMenuMoreKids',
        title: 'hide_youtube_kids',
        hide: [
            "#sections #items ytd-guide-entry-renderer:has([href*='youtubekids.com'])",
        ],
    }),
    moreFromYoutube.feature({
        id: 'hideMenuMoreStudio',
        title: 'hide_youtube_studio',
        hide: [
            "#sections #items ytd-guide-entry-renderer:has([href*='studio.youtube.com'])",
        ],
    }),
];

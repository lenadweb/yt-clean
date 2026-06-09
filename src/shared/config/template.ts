import { defineCategory } from 'src/shared/featureConfig/dsl';

const basicTemplate = defineCategory('basic_template');
const searchBar = basicTemplate.section('search_bar');
const actions = basicTemplate.section('actions_and_user');

export const templateFeatures = [
    searchBar.feature({
        id: 'voiceButtonInSearch',
        title: 'hide_voice_search_button',
        hide: ['#voice-search-button'],
    }),
    searchBar.feature({
        id: 'virtualKeyboard',
        title: 'hide_virtual_keyboard_button',
        hide: ['.ytSearchboxComponentYtdTextInputAssistantWrapper'],
    }),
    searchBar.feature({
        id: 'hideSearchTags',
        title: 'hide_search_tags',
        hide: [
            '.ytd-feed-filter-chip-bar-renderer',
            '#header.ytd-rich-grid-renderer',
            'yt-related-chip-cloud-renderer',
        ],
        styles: [
            `#chip-bar {
                    opacity: 0;
                    pointer-events: none;
                }
                #frosted-glass.with-chipbar.ytd-app {
                    height:64px!important;
                }
                `,
        ],
    }),
    actions.feature({
        id: 'hideCreateVideo',
        title: 'hide_upload_button',
        hide: ['#buttons .ytd-masthead:first-child'],
    }),
    actions.feature({
        id: 'notificationButton',
        title: 'hide_notifications',
        hide: ['ytd-notification-topbar-button-renderer.ytd-masthead'],
    }),
];

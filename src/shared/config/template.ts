import { category, feature, section } from 'src/shared/featureConfig/dsl';

export const templateCategory = category('basic_template', [
    section('search_bar', [
        feature({
            id: 'voiceButtonInSearch',
            title: 'hide_voice_search_button',
            hide: ['#voice-search-button'],
        }),
        feature({
            id: 'virtualKeyboard',
            title: 'hide_virtual_keyboard_button',
            hide: ['.ytSearchboxComponentYtdTextInputAssistantWrapper'],
        }),
        feature({
            id: 'hideSearchTags',
            title: 'hide_search_tags',
            hide: [
                'ytd-feed-filter-chip-bar-renderer',
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
    ]),
    section('actions_and_user', [
        feature({
            id: 'hideCreateVideo',
            title: 'hide_upload_button',
            hide: ['#buttons .ytd-masthead:first-child'],
        }),
        feature({
            id: 'notificationButton',
            title: 'hide_notifications',
            hide: ['ytd-notification-topbar-button-renderer.ytd-masthead'],
        }),
    ]),
]);

import { IFeatureDraft } from 'src/shared/types/config';
import {
    createFeature,
    hideAction,
    stylesAction,
} from 'src/shared/config/helpers';

const basicTemplate = 'basic_template';

const searchBarFeature = createFeature(basicTemplate, 'search_bar');
const actionsFeature = createFeature(basicTemplate, 'actions_and_user');

export const templateFeatures: IFeatureDraft[] = [
    searchBarFeature({
        titleKey: 'hide_voice_search_button',
        id: 'voiceButtonInSearch',
        actions: [hideAction(['#voice-search-button'])],
    }),
    searchBarFeature({
        titleKey: 'hide_virtual_keyboard_button',
        id: 'virtualKeyboard',
        actions: [
            hideAction(['.ytSearchboxComponentYtdTextInputAssistantWrapper']),
        ],
    }),
    searchBarFeature({
        titleKey: 'hide_search_tags',
        id: 'hideSearchTags',
        actions: [
            hideAction([
                '.ytd-feed-filter-chip-bar-renderer',
                '#header.ytd-rich-grid-renderer',
                'yt-related-chip-cloud-renderer',
            ]),
            stylesAction([
                `#chip-bar {
                    opacity: 0;
                    pointer-events: none;
                }
                #frosted-glass.with-chipbar.ytd-app {
                    height:64px!important;
                }
                `,
            ]),
        ],
    }),
    actionsFeature({
        titleKey: 'hide_upload_button',
        id: 'hideCreateVideo',
        actions: [hideAction(['#buttons .ytd-masthead:first-child'])],
    }),
    actionsFeature({
        titleKey: 'hide_notifications',
        id: 'notificationButton',
        actions: [
            hideAction([
                'ytd-notification-topbar-button-renderer.ytd-masthead',
            ]),
        ],
    }),
];

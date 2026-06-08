import { IFeatureConfig } from 'src/shared/types/config';
import {
    createFeature,
    hideAction,
    stylesAction,
} from 'src/shared/config/helpers';

const basicTemplate = 'Basic template';

const searchBarFeature = createFeature(basicTemplate, 'Search Bar');
const actionsFeature = createFeature(basicTemplate, 'Actions & user');

export const templateFeatures: IFeatureConfig[] = [
    searchBarFeature({
        title: 'Hide voice search button',
        storageKey: 'voiceButtonInSearch',
        actions: [hideAction('hide-voice-search', ['#voice-search-button'])],
    }),
    searchBarFeature({
        title: 'Hide virtual keyboard button',
        storageKey: 'virtualKeyboard',
        actions: [
            hideAction('hide-virtual-keyboard', [
                '.ytSearchboxComponentYtdTextInputAssistantWrapper',
            ]),
        ],
    }),
    searchBarFeature({
        title: 'Hide search tags',
        storageKey: 'hideSearchTags',
        actions: [
            hideAction('hide-search-tags', [
                '.ytd-feed-filter-chip-bar-renderer',
                '#header.ytd-rich-grid-renderer',
                'yt-related-chip-cloud-renderer',
            ]),
            stylesAction('hide-search-tags', [
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
        title: 'Hide upload button',
        storageKey: 'hideCreateVideo',
        actions: [
            hideAction('hide-create-video', [
                '#buttons .ytd-masthead:first-child',
            ]),
        ],
    }),
    actionsFeature({
        title: 'Hide notifications',
        storageKey: 'notificationButton',
        actions: [
            hideAction('hide-notification-button', [
                'ytd-notification-topbar-button-renderer.ytd-masthead',
            ]),
        ],
    }),
];

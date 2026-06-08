import { IFeatureDraft } from 'src/shared/types/config';
import {
    createFeature,
    hideAction,
    stylesAction,
} from 'src/shared/config/helpers';

const basicTemplate = 'Basic template';

const searchBarFeature = createFeature(basicTemplate, 'Search Bar');
const actionsFeature = createFeature(basicTemplate, 'Actions & user');

export const templateFeatures: IFeatureDraft[] = [
    searchBarFeature({
        title: 'Hide voice search button',
        id: 'voiceButtonInSearch',
        actions: [hideAction(['#voice-search-button'])],
    }),
    searchBarFeature({
        title: 'Hide virtual keyboard button',
        id: 'virtualKeyboard',
        actions: [
            hideAction(['.ytSearchboxComponentYtdTextInputAssistantWrapper']),
        ],
    }),
    searchBarFeature({
        title: 'Hide search tags',
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
        title: 'Hide upload button',
        id: 'hideCreateVideo',
        actions: [hideAction(['#buttons .ytd-masthead:first-child'])],
    }),
    actionsFeature({
        title: 'Hide notifications',
        id: 'notificationButton',
        actions: [
            hideAction([
                'ytd-notification-topbar-button-renderer.ytd-masthead',
            ]),
        ],
    }),
];

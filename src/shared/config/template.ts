import {
    ElementActions,
    IAttrAction,
    ISettingsBlock,
} from 'src/shared/types/config';
import { getAttr } from 'src/shared/utils/getAttr';

export const templateConfig: ISettingsBlock<IAttrAction[]> = {
    title: 'Basic template',
    settings: [
        {
            title: 'Search Bar',
            groups: [
                {
                    title: 'Hide voice search button',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('hide-voice-search'),
                            selectors: ['#voice-search-button'],
                        },
                    ],
                    storageKey: 'voiceButtonInSearch',
                },
                {
                    title: 'Hide virtual keyboard button',
                    actions: [
                        {
                            title: 'Virtual keyboard button',
                            action: ElementActions.hide,
                            attr: getAttr('hide-virtual-keyboard'),
                            selectors: [
                                '.ytSearchboxComponentYtdTextInputAssistantWrapper',
                            ],
                        },
                    ],
                    storageKey: 'virtualKeyboard',
                },
                {
                    title: 'Hide search tags',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('hide-search-tags'),
                            selectors: [
                                '.ytd-feed-filter-chip-bar-renderer',
                                '#frosted-glass',
                                '#header.ytd-rich-grid-renderer',
                                'yt-related-chip-cloud-renderer',
                            ],
                        },
                        {
                            action: ElementActions.customStyles,
                            attr: getAttr('hide-search-tags'),
                            selectors: [],
                            customStyles: [
                                `#chip-bar {
                                opacity: 0;
                                pointer-events: none;
                            }`,
                            ],
                        },
                    ],
                    storageKey: 'hideSearchTags',
                },
            ],
        },
        {
            title: 'Actions & user',
            groups: [
                {
                    title: 'Hide upload button',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('hide-create-video'),
                            selectors: ['#buttons .ytd-masthead:first-child'],
                        },
                    ],
                    storageKey: 'hideCreateVideo',
                },
                {
                    title: 'Hide notifications',
                    actions: [
                        {
                            action: ElementActions.hide,
                            attr: getAttr('hide-notification-button'),
                            selectors: [
                                'ytd-notification-topbar-button-renderer.ytd-masthead',
                            ],
                        },
                    ],
                    storageKey: 'notificationButton',
                },
            ],
        },
    ],
};

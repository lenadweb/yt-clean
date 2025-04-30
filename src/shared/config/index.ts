import { UrlRegExps } from 'src/shared/const';
import { ElementActions, IConfig } from 'src/shared/types/config';
import { getAttr } from 'src/shared/utils/getAttr';
import { templateConfig } from 'src/shared/config/template';
import { feedConfig } from 'src/shared/config/feed';
import { sidebarConfig } from 'src/shared/config/sidebar';
import { videoConfig } from 'src/shared/config/video';
import { limitConfig } from 'src/shared/config/limit';

export const CONFIG: IConfig = {
    domActions: [
        templateConfig,
        feedConfig,
        videoConfig,
        sidebarConfig,
        limitConfig,
        {
            title: 'Other',
            settings: [
                {
                    title: 'Hide Related videos',
                    groups: [
                        {
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr('hide-related-videos'),
                                    selectors: ['#related'],
                                },
                            ],
                            storageKey: 'relatedVideos',
                        },
                    ],
                },
                {
                    title: 'Right comment mode',
                    groups: [
                        {
                            actions: [
                                {
                                    urlRegExp: [UrlRegExps.Watch],
                                    attr: getAttr(),
                                    action: ElementActions.custom,
                                    selectors: [],
                                },
                            ],
                            storageKey: 'rightCommentMode',
                        },
                    ],
                },
                {
                    title: 'Hide related video',
                    groups: [
                        {
                            actions: [
                                {
                                    action: ElementActions.hide,
                                    attr: getAttr(
                                        'hide-related-video-description'
                                    ),
                                    selectors: [
                                        '#description #infocards-section',
                                    ],
                                },
                            ],
                            storageKey: 'hideDescriptionRelatedVideo',
                        },
                    ],
                },
            ],
        },
    ],
    storageActions: [],
};

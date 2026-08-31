import { UrlRegExps } from 'src/shared/const';
import { category, feature, section } from 'src/shared/featureConfig/dsl';
import { syncLiveChatVisibility } from 'src/shared/featureHandlers/video';

export const watchCategory = category('video_page', [
    section('video_page_elements', { isNew: true, controls: 'checkboxes' }, [
        feature({
            id: 'hideComments',
            title: 'hide_comments',
            url: [UrlRegExps.Watch],
            hide: ['ytd-comments#comments'],
        }),
        feature({
            id: 'hideLikeDislike',
            title: 'hide_like_dislike',
            url: [UrlRegExps.Watch],
            hide: [
                'ytd-watch-metadata segmented-like-dislike-button-view-model',
            ],
        }),
        feature({
            id: 'hideActionButtons',
            title: 'hide_action_buttons',
            url: [UrlRegExps.Watch],
            hide: [
                'ytd-watch-metadata #flexible-item-buttons',
                'ytd-watch-metadata #top-level-buttons-computed > *:not(segmented-like-dislike-button-view-model)',
            ],
        }),
        feature({
            id: 'hideDescription',
            title: 'hide_description',
            url: [UrlRegExps.Watch],
            hide: ['ytd-watch-metadata #description'],
        }),
        feature({
            id: 'hideLiveChat',
            title: 'hide_live_chat',
            url: [UrlRegExps.Watch],
            onChange: syncLiveChatVisibility,
            hide: [
                'ytd-live-chat-frame#chat',
                'div#chat-container',
                'div#chat-container-live-stream-chat',
                '#full-bleed-chat-container #panels-full-bleed-container',
                '#full-bleed-container #panels-full-bleed-container:has(ytd-live-chat-frame)',
            ],
            styles: [
                `ytd-watch-flexy[fixed-panels]:has(ytd-live-chat-frame) #columns.ytd-watch-flexy {
                    padding-right: 0 !important;
                }

                ytd-watch-flexy .html5-video-container {
                    width: 100% !important;
                    height: 100% !important;
                }

                ytd-watch-flexy video.html5-main-video {
                    width: 100% !important;
                    height: 100% !important;
                    left: 0 !important;
                    top: 0 !important;
                    object-fit: contain !important;
                }`,
            ],
        }),
        feature({
            id: 'hideMerch',
            title: 'hide_merch_and_tickets',
            url: [UrlRegExps.Watch],
            hide: [
                'ytd-merch-shelf-renderer',
                '#ticket-shelf',
                '#product-shelf',
            ],
        }),
        feature({
            id: 'hideEndScreenCards',
            title: 'hide_end_screen_cards',
            url: [UrlRegExps.Watch],
            hide: ['.ytp-ce-element', '.ytp-cards-teaser'],
        }),
    ]),
    section('video_description', { isNew: true, controls: 'checkboxes' }, [
        feature({
            id: 'hideDescriptionAi',
            title: 'hide_description_ai',
            url: [UrlRegExps.Watch],
            hide: [
                'yt-video-description-youchat-section-view-model',
                '#video-summary',
            ],
        }),
        feature({
            id: 'hideDescriptionTranscript',
            title: 'hide_description_transcript',
            url: [UrlRegExps.Watch],
            hide: ['ytd-video-description-transcript-section-renderer'],
        }),
        feature({
            id: 'hideDescriptionPeople',
            title: 'hide_description_people',
            url: [UrlRegExps.Watch],
            hide: ['yt-video-attributes-section-view-model'],
        }),
        feature({
            id: 'hideDescriptionRelated',
            title: 'hide_description_related',
            url: [UrlRegExps.Watch],
            hide: [
                'ytd-compact-infocard-renderer:has(ytd-structured-description-video-lockup-renderer)',
                'ytd-structured-description-video-lockup-renderer',
            ],
        }),
        feature({
            id: 'hideDescriptionChannel',
            title: 'hide_description_channel',
            url: [UrlRegExps.Watch],
            hide: ['ytd-video-description-infocards-section-renderer'],
        }),
        feature({
            id: 'hideDescriptionHowMade',
            title: 'hide_how_this_was_made',
            url: [UrlRegExps.Watch],
            hide: ['how-this-was-made-section-view-model'],
        }),
        feature({
            id: 'hideDescriptionChapters',
            title: 'hide_description_chapters',
            url: [UrlRegExps.Watch],
            hide: [
                'ytd-structured-description-content-renderer ytd-horizontal-card-list-renderer:has(ytd-macro-markers-list-item-renderer)',
            ],
        }),
    ]),
]);

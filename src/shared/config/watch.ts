import { UrlRegExps } from 'src/shared/const';
import { category, feature, section } from 'src/shared/featureConfig/dsl';

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
            hide: ['ytd-live-chat-frame#chat', '#chat-container'],
        }),
        feature({
            id: 'hideMerch',
            title: 'hide_merch_and_tickets',
            isNew: true,
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
            isNew: true,
            url: [UrlRegExps.Watch],
            hide: ['.ytp-ce-element', '.ytp-cards-teaser'],
        }),
    ]),
]);

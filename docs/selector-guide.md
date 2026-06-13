# Selector guide

YouTube changes markup often and runs A/B experiments, so a feature is only as
good as its selector. Prefer selectors that describe product structure or
navigation intent, not visual implementation details.

## Good selector anchors

- Custom YouTube elements: `ytd-banner-promo-renderer`,
  `ytd-channel-video-player-renderer`, `yt-related-chip-cloud-renderer`.
- Stable ids: `#voice-search-button`, `#page-header-banner`, `#guide-button`.
- Destination links: `:has([href="/feed/history"])`,
  `:has([href="/playlist?list=WL"])`, `:has([href*="studio.youtube.com"])`.
- ARIA labels when they are the only practical anchor:
  `ytd-mini-guide-entry-renderer[aria-label=Shorts]`.
- Page-specific wrappers when the feature is scoped by URL, for example a
  Watch-only player selector with `url: [UrlRegExps.Watch]`.

## Risky selector anchors

- Generated or framework classes: `style-scope`, `yt-spec-*`,
  layout-only class names, hashed classes, and anything that changes when the
  same element is restyled.
- Deep positional selectors such as `div:nth-child(3) > div > ytd-*`.
- Text-only selectors. They break across locales and YouTube copy changes.
- Broad selectors that can hide unrelated UI, for example `#items > *` without
  a stable parent and a narrow condition.
- Selectors that only work while the element is already visible. Many YouTube
  panels lazy-render after scrolling or after opening menus.

## Recommended workflow

1. Reproduce the element on a live YouTube page.
2. Inspect the element and identify the nearest stable wrapper.
3. Prefer a custom element, id, or `href` over a class.
4. Test the selector in DevTools with `document.querySelectorAll('...')`.
5. Toggle the setting on and off in the extension side panel.
6. Refresh the page and test again; YouTube often re-renders after navigation.

## Page coverage checklist

When a selector targets shared YouTube UI, test it on more than one page type:

- Home: `https://www.youtube.com/`
- Search results: `https://www.youtube.com/results?search_query=test`
- Watch page: `https://www.youtube.com/watch?v=...`
- Shorts: `https://www.youtube.com/shorts/...`
- Channel page: `https://www.youtube.com/@...`

If the selector only belongs to one page type, add `url` in the feature config
instead of relying on the selector to be harmless elsewhere.

## Common patterns

Hide a sidebar item by destination:

```ts
feature({
    id: 'hideMenuWatchLater',
    title: 'hide_watch_later',
    hide: [
        '#section-items ytd-guide-entry-renderer:has([href="/playlist?list=WL"])',
    ],
});
```

Hide a feed module by renderer type:

```ts
feature({
    id: 'adsYoutubeBanner',
    title: 'hide_youtube_banners',
    hide: ['ytd-banner-promo-renderer'],
});
```

Scope a feature to one URL family:

```ts
feature({
    id: 'shortSpeedControl',
    title: 'speed_control',
    url: [UrlRegExps.Shorts],
    component: {
        name: 'ShortsSpeedControl',
        after: '#cinematic-container',
    },
});
```

## PR notes

In feature PRs, include the selector and where it was tested. If a selector is
known to depend on a YouTube experiment, mention that explicitly so maintainers
can decide whether the feature should wait for a more stable anchor.

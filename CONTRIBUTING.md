# Contributing

## Add a YouTube cleanup feature

Most features are configured in `src/shared/config`. Pick the file that matches
the YouTube area you are changing:

- `template.ts` - header, search, user actions
- `feed.ts` - feed and recommendations
- `video.ts` - player, Shorts, channel pages
- `sidebar.ts` - sidebar menu items

Use `defineCategory` from `src/shared/featureConfig/dsl` instead of runtime
action objects.

```ts
const feed = defineCategory('feed_and_recommendations');
const contentBlocks = feed.section('content_blocks');

export const feedFeatures = [
    contentBlocks.feature({
        id: 'hideExample',
        title: 'hide_example',
        hide: ['ytd-example-renderer'],
    }),
];
```

Common feature fields:

- `id` - stable storage key. Do not rename it after release.
- `title` - Chrome i18n message key.
- `hide` - CSS selectors hidden when the feature is enabled.
- `styles` - custom CSS enabled through a generated body attribute.
- `url` - optional URL filters from `UrlRegExps`.
- `component` - React component injection target.
- `custom` - custom enable/disable handlers for non-CSS behavior.

For a new setting id, also update:

- `src/shared/types/settings.ts`
- `src/shared/storage/config.ts`
- every `src/_locales/*/messages.json`

Run checks before opening a PR:

```bash
yarn lint
npx tsc --noEmit
npx webpack --env platform=chrome
```

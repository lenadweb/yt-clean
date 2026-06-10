# Contributing

## Add a YouTube cleanup feature

Most features are configured in `src/shared/config`. Pick the file that matches
the YouTube area you are changing:

- `template.ts` - header, search, user actions
- `feed.ts` - feed and recommendations
- `video.ts` - player, Shorts, channel pages
- `sidebar.ts` - sidebar menu items

Use `category`, `section`, and `feature` from `src/shared/featureConfig/dsl`
instead of runtime action objects. Each config file exports one category tree:

```ts
export const feedCategory = category('feed_and_recommendations', [
    section('content_blocks', [
        feature({
            id: 'hideExample',
            title: 'hide_example',
            hide: ['ytd-example-renderer'],
        }),
    ]),
]);
```

Common feature fields:

- `id` - stable storage key. Do not rename it after release.
- `title` - Chrome i18n message key, checked against `en/messages.json` at
  compile time.
- `hide` - CSS selectors hidden when the feature is enabled.
- `styles` - custom CSS enabled through a generated body attribute.
- `url` - optional URL filters from `UrlRegExps`.
- `component` - React component injection target. The name must be registered
  in `COMPONENT_NAMES` in `src/shared/const.ts` and in the content component
  registry.
- `custom` - custom enable/disable handlers for non-CSS behavior.

Section options go in the optional second argument of `section`: `isNew`,
`controls` (`'switch'` renders only the master switch, `'checkboxes'` only
the checkbox list, omit for both), and `hideWhenAllEnabled` for selectors
hidden only when every feature in the section is enabled.

For a new title, also update every `src/_locales/*/messages.json`. Missing
keys fail `pnpm typecheck` (config titles) and `pnpm test` (locale parity).

Setting ids and storage defaults are generated from the feature config. Add
`defaultValue` only for settings that need a saved value, such as sliders or
dropdowns.

Run checks before opening a PR:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

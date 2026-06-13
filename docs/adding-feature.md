# Adding a feature

A typical "hide element X" feature is a small diff in two kinds of files:
one config entry and one translation key per locale. Everything else - the
storage key, the default setting, the CSS, and the sidebar checkbox - is
generated from the declarative config.

Use this guide for implementation details. If you are still looking for a
stable selector, start with [Selector guide](selector-guide.md).

## 1. Find a selector

Open YouTube, right-click the element you want to hide, and choose
**Inspect**. Prefer stable, semantic anchors over generated class names:

- tag names: `ytd-banner-promo-renderer`
- ids: `#voice-search-button`
- `:has()` with an `href`: `ytd-guide-entry-renderer:has([href="/feed/history"])`

Avoid classes like `style-scope` or anything that looks auto-generated. Those
change between YouTube experiments and break the feature silently.

## 2. Declare the feature

Pick the config file by the YouTube area:

| File                            | Area                             |
| ------------------------------- | -------------------------------- |
| `src/shared/config/template.ts` | header, search bar, user actions |
| `src/shared/config/feed.ts`     | home feed and recommendations    |
| `src/shared/config/video.ts`    | player, Shorts, channel pages    |
| `src/shared/config/sidebar.ts`  | left sidebar menu                |

Add a `feature()` to an existing `section()`:

```ts
section('content_blocks', [
    // ...existing features...
    feature({
        id: 'hidePlayables',
        title: 'hide_playables',
        hide: ['ytd-rich-section-renderer:has([href^="/playables"])'],
    }),
]),
```

That's the whole runtime change. Field rules:

- `id` is a unique camelCase string. It becomes the `chrome.storage.local` key
  and the body attribute (`cln-yt-cust-feature-hide-playables`), so never
  rename it after release. Users would lose their saved setting.
- `title` is the i18n key for the sidebar checkbox label.
- `hide` is a list of selectors. It compiles to
  `[cln-yt-cust-feature-...] <selector> { display: none !important; }` in
  `content.css`.

## 3. Add the translation

Add the `title` key to every file in `src/_locales/*/messages.json`:

- `en`
- `de`
- `es`
- `fr`
- `hi`
- `it`
- `ja`
- `pt_BR`
- `zh_CN`

Example:

```json
"hide_playables": {
    "message": "Hide playables"
}
```

You cannot forget this step silently. `pnpm typecheck` fails if the key is
missing from `en/messages.json`, and `pnpm test` fails if any locale is out of
sync with `en`.

## 4. Try it locally

```bash
pnpm dev
```

Reload the extension on `chrome://extensions`, refresh YouTube, open the side
panel, and toggle the new setting. The checkbox is generated automatically in
the section where you added the feature.

## What you get for free

For each `feature()` entry the project generates:

- a storage key and default (`enabled: false`, or `defaultEnabled` if set)
- a body attribute toggled by the content script when the feature is on
- static CSS in `content.css` for `hide` and `styles`
- a checkbox in the side panel, grouped under its section and category
- a "new" badge if you pass `isNew: true`

## Beyond hiding: all feature fields

```ts
feature({
    id: 'myFeature',
    title: 'my_feature', // i18n key, required unless the section is switch-only
    isNew: true, // "new" badge in the sidebar
    defaultEnabled: true, // on by default for new installs
    url: [UrlRegExps.Watch], // apply only on matching pages (const.ts)
    hide: ['selector'], // hide elements via generated CSS
    styles: ['#x { color: red; }'], // arbitrary CSS, scoped by the body attribute
    component: {
        // inject a React component
        name: 'PlaybackSpeed', // must exist in COMPONENT_NAMES (const.ts)
        after: '.ytp-settings-button',
    },
    custom: {
        // run code on toggle
        enable: onEnable, // may return cached elements...
        disable: onDisable, // ...restored here on disable
    },
    onChange: syncValue, // called when the stored value changes (slider)
});
```

Notes:

- `url` patterns live in `src/shared/const.ts` (`UrlRegExps.Watch`, `Shorts`,
  `Channel`). Without `url` a feature applies everywhere on YouTube.
- `component` names are typed: add the component to `COMPONENT_NAMES` in
  `src/shared/const.ts` and register it in
  `src/content/features/componentRegistry.ts`. The component renders inside a
  shadow root next to the `after` selector.
- `custom` handlers live in `src/shared/featureHandlers/`. See
  `hideChannelTrailer` / `restoreChannelTrailer` for the cache-and-restore
  pattern.

## New section or category

A section groups checkboxes under one sub-header with a master switch:

```ts
section('my_section', [
    // features
]);
```

Options go in the optional second argument:

```ts
section(
    'my_section',
    {
        isNew: true,
        controls: 'switch', // 'switch' = master switch only; 'checkboxes' = no master switch
        hideWhenAllEnabled: ['#sections ytd-guide-section-renderer:has(...)'],
    },
    [
        // features
    ]
);
```

Section and category titles are i18n keys too. A new category is one
`category('key', [...sections])` export. Wire it into the list in
`src/shared/featureConfig/index.ts`.

## Checklist before a PR

- [ ] `id` is new and unique; never reuse or rename released ids.
- [ ] Title key is added to all locales.
- [ ] Selectors were tested on a live YouTube page with the setting on and off.
- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` pass.

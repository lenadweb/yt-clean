<h1 align="center">YouTube Clean</h1>

<p align="center">
  A browser extension that declutters YouTube — hide Shorts, ads, and sidebar
  items, simplify the player and feed, and add handy controls like a playback
  speed slider, all toggled from a side panel.
</p>

<p align="center">
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
  <a href="https://github.com/lenadweb/yt-clean/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/lenadweb/yt-clean/actions/workflows/ci.yml/badge.svg"></a>
  <img alt="Manifest V3" src="https://img.shields.io/badge/Manifest-V3-success.svg">
  <img alt="Chrome &amp; Opera" src="https://img.shields.io/badge/Chrome%20%26%20Opera-supported-orange.svg">
</p>

<p align="center">
  <em>Manifest V3 · React 19 · TypeScript · Tailwind CSS</em>
</p>

## Features

- Hide Shorts sections, mixes, and playlists across the feed
- Remove sponsored videos and promotional banners
- Clean up the search bar, masthead, and player controls
- Playback speed slider for videos and a dedicated one for Shorts
- Auto-advance to the next Short
- Trim the sidebar (You, Explore, More from YouTube, …) item by item
- Channel page cleanup (banner, trailer)

Every feature is opt-in and persists in `chrome.storage.local`. A master
toggle enables or disables the whole extension at once.

## Getting started

Requires [Node.js](https://nodejs.org) (>= 20.9) and [pnpm](https://pnpm.io)
(`corepack enable` will pick the version from `package.json`).

```bash
pnpm install
pnpm dev          # watch build into ./dist
```

Then load the unpacked extension:

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. **Load unpacked** → select the `dist` folder

### Production builds

```bash
pnpm build          # one-off chrome build into ./dist
pnpm build:chrome   # bumps version, outputs release/build-<version>.zip
pnpm build:opera    # Opera-specific manifest
```

### Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm format
```

## How it works

Everything is driven by a declarative feature config — you describe *what* a
feature does, and the build/runtime turn that into UI, CSS, and DOM behavior.

<p align="center">
  <img src="docs/architecture.svg" alt="yt-clean architecture: one declarative config compiles into content.css, content.js, and the side-panel UI, with Storage as the shared source of truth" width="100%">
</p>

The three entry points (`webpack.config.js`):

| Entry     | Source                | Role                                            |
| --------- | --------------------- | ----------------------------------------------- |
| `content` | `src/content/`        | Applies features on the page                    |
| `sidebar` | `src/sidebar/`        | Settings UI (Chrome side panel)                 |
| `worker`  | `src/worker/index.ts` | Opens the side panel on toolbar click           |

Settings are a single source of truth: the [`Storage`](src/shared/storage/index.ts)
singleton mirrors `chrome.storage.local` in memory and feeds both the imperative
DOM layer and the React UI (via `StorageProvider`).

CSS-only features (`hide` / `styles`) cost nothing at runtime — they are
compiled into `content.css` and switched on by a per-feature body attribute.
Only behavioral features (`custom`, `component`) run JavaScript.

## Adding a feature

A typical "hide element X" feature is a ~10 line diff in two kinds of files:
one config entry and one translation key per locale. Everything else — the
storage key, the default setting, the CSS, the sidebar checkbox — is generated.

### 1. Find a selector

Open YouTube, right-click the element you want to hide → **Inspect**. Prefer
stable, semantic anchors over generated class names:

- tag names: `ytd-banner-promo-renderer`
- ids: `#voice-search-button`
- `:has()` with an `href`: `ytd-guide-entry-renderer:has([href="/feed/history"])`

Avoid classes like `style-scope` or anything that looks auto-generated — those
change between YouTube experiments and break the feature silently.

### 2. Declare the feature

Pick the config file by the YouTube area:

| File                        | Area                                |
| --------------------------- | ----------------------------------- |
| `src/shared/config/template.ts` | header, search bar, user actions |
| `src/shared/config/feed.ts`     | home feed and recommendations    |
| `src/shared/config/video.ts`    | player, Shorts, channel pages    |
| `src/shared/config/sidebar.ts`  | left sidebar menu                |

Add a `feature()` to an existing `section()`:

```ts
section('content_blocks', [
    // …existing features…
    feature({
        id: 'hidePlayables',
        title: 'hide_playables',
        hide: ['ytd-rich-section-renderer:has([href^="/playables"])'],
    }),
]),
```

That's the whole runtime change. Field rules:

- `id` — unique camelCase string. It becomes the `chrome.storage.local` key
  and the body attribute (`cln-yt-cust-feature-hide-playables`), so **never
  rename it after release** — users would lose their saved setting.
- `title` — i18n key for the sidebar checkbox label (see step 3).
- `hide` — list of selectors. Compiles to
  `[cln-yt-cust-feature-…] <selector> { display: none !important; }` in
  `content.css`.

### 3. Add the translation

Add the `title` key to **every** file in `src/_locales/*/messages.json`
(en, de, es, fr, hi, it, ja, pt_BR, zh_CN):

```json
"hide_playables": {
    "message": "Hide playables"
}
```

You can't forget this step: `pnpm typecheck` fails if the key is missing from
`en/messages.json` (titles are typed against it), and `pnpm test` fails if any
locale is out of sync with `en`.

### 4. Try it

```bash
pnpm dev
```

Reload the extension on `chrome://extensions`, refresh YouTube, open the side
panel — the checkbox is already there, in the section you added the feature
to. Toggle it and watch the element disappear.

### What you get for free

For each `feature()` entry the project generates:

- a storage key and default (`enabled: false`, or `defaultEnabled` if set)
- a body attribute toggled by the content script when the feature is on
- static CSS in `content.css` (for `hide` / `styles`)
- a checkbox in the side panel, grouped under its section and category
- a "new" badge if you pass `isNew: true`

### Beyond hiding: all feature fields

```ts
feature({
    id: 'myFeature',
    title: 'my_feature',           // i18n key, required unless the section is switch-only
    isNew: true,                   // "new" badge in the sidebar
    defaultEnabled: true,          // on by default for new installs
    url: [UrlRegExps.Watch],       // apply only on matching pages (const.ts)
    hide: ['selector'],            // hide elements via generated CSS
    styles: ['#x { color: red; }'],// arbitrary CSS, scoped by the body attribute
    component: {                   // inject a React component
        name: 'PlaybackSpeed',     // must exist in COMPONENT_NAMES (const.ts)
        after: '.ytp-settings-button',
    },
    custom: {                      // run code on toggle
        enable: onEnable,          // may return cached elements…
        disable: onDisable,        // …restored here on disable
    },
    onChange: syncValue,           // called when the stored value changes (slider)
})
```

Notes:

- `url` patterns live in [`src/shared/const.ts`](src/shared/const.ts)
  (`UrlRegExps.Watch`, `Shorts`, `Channel`). Without `url` a feature applies
  everywhere on YouTube.
- `component` names are typed: add the component to `COMPONENT_NAMES` in
  `src/shared/const.ts` and register it in
  [`src/content/features/componentRegistry.ts`](src/content/features/componentRegistry.ts).
  The component renders inside a shadow root next to the `after` selector.
- `custom` handlers live in `src/shared/featureHandlers/` — see
  `hideChannelTrailer` / `restoreChannelTrailer` for the cache-and-restore
  pattern.

### New section or category

A section groups checkboxes under one sub-header with a master switch:

```ts
section('my_section', [ …features… ])
```

Options go in the optional second argument:

```ts
section('my_section', {
    isNew: true,                  // badge on the section header
    controls: 'switch',           // 'switch' = master switch only (single-feature sections)
                                  // 'checkboxes' = checkbox list without a master switch
                                  // omit = both
    hideWhenAllEnabled: ['#sections ytd-guide-section-renderer:has(…)'],
                                  // extra selectors hidden only when EVERY feature
                                  // in the section is on (e.g. the whole sidebar block)
}, [ …features… ])
```

Section and category titles are i18n keys too. A new category is one
`category('key', [ …sections… ])` export — wire it into the list in
[`src/shared/featureConfig/index.ts`](src/shared/featureConfig/index.ts).

### Checklist before a PR

- [ ] `id` is new and unique (never reuse or rename released ids)
- [ ] title key added to all 9 locales
- [ ] selectors tested on a live YouTube page, on/off both work
- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` pass

More on the workflow in [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) © lenadweb

<h1 align="center">YouTube Clean</h1>

<p align="center">
  A browser extension that declutters YouTube — hide Shorts, ads, and sidebar
  items, simplify the player and feed, and add handy controls like a playback
  speed slider, all toggled from a side panel.
</p>

<p align="center">
  <a href="https://chromewebstore.google.com/detail/dnglnblikgiogcfdbhaapakjamhfldhd?utm_source=gh"><img alt="Chrome Web Store" src="https://img.shields.io/chrome-web-store/v/dnglnblikgiogcfdbhaapakjamhfldhd?label=Chrome%20Web%20Store&logo=googlechrome&logoColor=white&color=4285F4"></a>
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
  <a href="https://github.com/lenadweb/yt-clean/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/lenadweb/yt-clean/actions/workflows/ci.yml/badge.svg"></a>
  <img alt="Manifest V3" src="https://img.shields.io/badge/Manifest-V3-success.svg">
  <img alt="Chrome &amp; Opera" src="https://img.shields.io/badge/Chrome%20%26%20Opera-supported-orange.svg">
</p>

<p align="center">
  <a href="https://chromewebstore.google.com/detail/dnglnblikgiogcfdbhaapakjamhfldhd?utm_source=gh">
    <img alt="Install from the Chrome Web Store" src="https://fonts.gstatic.com/s/i/productlogos/chrome_store/v7/192px.svg" height="56">
  </a>
  <br>
  <strong><a href="https://chromewebstore.google.com/detail/dnglnblikgiogcfdbhaapakjamhfldhd?utm_source=gh">Install from the Chrome Web Store</a></strong>
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

Requires [Node.js](https://nodejs.org) (>= 20.19), which includes npm.

```bash
npm install
npm run dev          # watch build into ./dist
```

Then load the unpacked extension:

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. **Load unpacked** → select the `dist` folder

### Production builds

```bash
npm run build          # one-off chrome build into ./dist
npm run build:chrome   # bumps version, outputs release/build-chrome-<version>.zip
npm run build:opera    # Opera-specific manifest
```

### Checks

```bash
npm run lint
npm run typecheck
npm test
npm run format
```

### Manual feedback (PostHog)

Copy `.env.example` to `.env` and set `VITE_POSTHOG_PROJECT_TOKEN` to your
PostHog **public project token**. Set `VITE_POSTHOG_HOST` to the HTTPS ingestion
host for that project (defaults to `https://eu.i.posthog.com`). Rebuild after
changing either value. These Vite-compatible names match `ai-usage-extension`;
this project's webpack build loads them using dotenv. Environment variables
override `.env`; `.env.example` is never loaded as runtime configuration.

For GitHub Actions, add repository secrets under **Settings → Secrets and
variables → Actions**: `VITE_POSTHOG_PROJECT_TOKEN` (required for releases) and
`VITE_POSTHOG_HOST` (optional; the EU ingestion host is the default). CI and
release workflows pass these directly to the build environment. Release checks
for an empty token before building Chrome and Opera archives. CI can still
build without feedback configuration, including pull requests from forks.

The feedback button beside “View on GitHub” opens a problem / feature request
form. The background worker sends `problem_reported` or `feature_requested`
through the [PostHog Capture API](https://posthog.com/docs/api/capture), only
when the user presses Send. Find reports in PostHog Events and inspect the
`message`, `feedback_type`, `app_version` and `app: youtube-clean` properties.
Successful submission requires an acknowledged HTTP response; errors preserve
the draft in the open panel and offer a GitHub issue link. Drafts are not
persisted after the panel closes. No token means sending is unavailable, with
the same GitHub fallback. Requests use ordinary CORS with credentials omitted;
PostHog Cloud allows the extension origin, POST and the Content-Type header.
No PostHog host permission is added to the Chrome or Opera manifest. A custom
ingestion host must also allow these CORS requests and expose its response.

No analytics SDK, automatic events, session recordings, browsing history,
account details or settings are collected. Each report has a new random ID;
person profiles and GeoIP enrichment are disabled. The message, its type and
the extension version are sent with basic event metadata. PostHog receives
the network request (including the sender's IP address at the transport layer).
Users should not include sensitive information in their message. Store
descriptions disclose this optional feedback; keep any published privacy
policy and store data-use disclosures consistent when releasing this feature.

## How it works

Everything is driven by a declarative feature config — you describe _what_ a
feature does, and the build/runtime turn that into UI, CSS, and DOM behavior.

<p align="center">
  <img src="docs/architecture.svg" alt="yt-clean architecture: one declarative config compiles into content.css, content.js, and the side-panel UI, with Storage as the shared source of truth" width="100%">
</p>

The three entry points (`webpack.config.js`):

| Entry     | Source                | Role                                  |
| --------- | --------------------- | ------------------------------------- |
| `content` | `src/content/`        | Applies features on the page          |
| `sidebar` | `src/sidebar/`        | Settings UI (Chrome side panel)       |
| `worker`  | `src/worker/index.ts` | Opens the side panel on toolbar click |

Settings are a single source of truth: the [`Storage`](src/shared/storage/index.ts)
singleton mirrors `chrome.storage.local` in memory and feeds both the imperative
DOM layer and the React UI (via `StorageProvider`).

CSS-only features (`hide` / `styles`) cost nothing at runtime — they are
compiled into `content.css` and switched on by a per-feature body attribute.
Only behavioral features (`custom`, `component`) run JavaScript.

## Contributing features

A typical "hide element X" feature is a small diff: one declarative config
entry and one translation key per locale. Storage, defaults, CSS, and sidebar
UI are generated.

- [Adding a feature](docs/adding-feature.md) - step-by-step implementation
- [Selector guide](docs/selector-guide.md) - how to pick stable YouTube selectors
- [Feature catalog](docs/feature-catalog.md) - current features and config areas
- [Contributing](CONTRIBUTING.md) - PR workflow and required checks

## License

[MIT](LICENSE) © lenadweb

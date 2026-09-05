# Promo generator

Store artwork is a React app rendered at exact pixel sizes and captured with headless Chrome.

## Commands

- `npm run promo:dev` — live preview at http://localhost:4400 with hot reload, scene switcher and zoom.
- `npm run promo:build` — production bundle into `promo-dist/`.
- `npm run promo:generate` — build and capture every scene into `store/assets/`.
- `node capturePromo.js hero` — recapture a single scene.

## Structure

- `src/promo/scenes.json` — scene registry shared by the app and the capture script (id, output file, size).
- `src/promo/scenes/*.tsx` — one component per image.
- `src/promo/components/` — `Backdrop`, `SidebarPanel` (real sidebar `App` with mock storage), `SettingsStage` (real accordions), `YouTubeMock`.
- `src/promo/styles/` — base tokens plus one file per scene.
- `src/promo/Preview.tsx` — dev-only shell; `?scene=<id>` renders a single scene at 1:1 for capture.

## Scenes

| File | Size | Content |
| --- | --- | --- |
| `promo-1.png` | 1280 × 800 | Hero: logo, wordmark, tagline, trust pills, real sidebar panel |
| `promo-2.png` | 1280 × 800 | Before / After YouTube feed with the junk blocks marked in red |
| `promo-3.png` | 1280 × 800 | Six real setting accordions from the production UI |
| `promo-small-tile.png` | 440 × 280 | Chrome Web Store small promo tile: the hero composition condensed, with a dense sidebar panel |

## Notes

- Fonts are inlined as data URIs in the promo bundle; loading them over the network raced the screenshot and produced invisible text.
- The sidebar panel renders the production `Settings`, `PresetTags`, accordion, switch and checkbox components with mock state, so it never drifts from the real UI.
- Capture runs at DPR 1 so the output matches the Chrome Web Store sizes exactly; Chrome writes 24-bit RGB PNGs with no alpha channel, which is what the small tile requires.
- No glow, neon or bloom anywhere — flat surfaces, one flat red accent.
- The YouTube mock uses skeleton bars for titles and channels: no invented video or channel names in store artwork.
- `.promo-scene [data-closed]` neutralises Headless UI's enter transition; without it a screenshot could land before an accordion finished opening and captured an empty panel.
- The sidebar panel runs off the bottom edge (`bleed`): square bottom corners, no bottom border, as much content as fits. Every other element keeps a margin and is never clipped; the before/after windows fade their feed out instead of cutting it.
- Scene 3 renders the real `SettingsAccordion` / `SettingsGroup` / `Switch` / `Checkbox` components over the real feature config, so labels and badges always match the shipped UI.

## Result

passed

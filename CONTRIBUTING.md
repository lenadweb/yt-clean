# Contributing

## Add a YouTube cleanup feature

The full step-by-step guide lives in
[README → Adding a feature](README.md#adding-a-feature). The short version:

1. Add a `feature()` entry to the matching `src/shared/config/*.ts` file
   using `category` / `section` / `feature` from
   `src/shared/featureConfig/dsl` — never raw action objects.
2. Add the title key to every `src/_locales/*/messages.json`.

Setting ids, storage defaults, CSS, and the sidebar UI are generated from the
config. `id` is a released storage key — do not rename it.

## Checks

Run before opening a PR:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`typecheck` validates i18n keys in config against `en/messages.json`;
`test` validates locale parity and the generated config invariants.

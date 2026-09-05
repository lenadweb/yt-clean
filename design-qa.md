# Promo generator design QA

- Source: `store/promo/reference/promo-1.png`
- Implementation: `store/assets/promo-1.png`
- Viewport: 1280 × 800, DPR 1
- State: English locale, Custom preset, extension enabled, Basic template expanded
- Rendering: production React bundle captured with headless Chrome

## Comparison

- Full view: brand mark, headline, tagline, open-source badge, benefits, background lighting, and sidebar placement checked against the source.
- Focused view: the sidebar uses the production `App`, `Settings`, preset, accordion, switch, and checkbox components with mock state supplied through props.
- Final adjustment: removed perspective distortion, restored the sidebar's normal width, and applied uniform 1.4× scaling so overflow is cropped by the 1280 × 800 canvas.

## Result

passed

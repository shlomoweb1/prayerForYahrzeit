# DESIGN.md - Izkor (יזכור)

## Context (from discovery)

- Artifact type: wizard + generated print sheet (Hebrew memorial / yahrzeit prayer sheet), landing page + multi-step form + PDF output
- Positioning: traditional / memorial / devotional
- Audience: Hebrew-speaking families preparing a memorial page for a loved one | Primary action: complete the wizard and get a printed yahrzeit sheet
- Adjectives: reverent, warm, aged, composed, meaningful
- Visual word translations:
  - reverent -> muted palette, centered composition, ornament accents, no loud gradients
  - warm -> candle-amber golds, warm paper and stone tones, soft light
  - aged -> parchment textures, faded stone, serif display faces, thin gold rules
  - composed -> strong vertical rhythm, generous whitespace, one clear focal point per page
  - meaningful -> ornament limited to memorial symbols (candle, divider, frame corners); no decorative blobs
- Aesthetic essence: memorial candle, old parchment, stone
- Single-minded proposition: this page feels like a proper Jewish memorial object, not a web form
- Archetype: Sage
- References: admire traditional yizkor/memorial sheets and siddurim (gold-rule ornament, candle imagery); avoid glossy SaaS stock and indigo-purple AI default
- Mode: both (3 themes x light/dark) | Density: balanced
- Constraints: React 19 + Tailwind v4 (shadcn tokens), TanStack Router/Query, i18next (he/en/es/fr), WASM PDF pipeline must keep working, Hebrew RTL-first, a11y-contrast overrides (html.a11y-contrast) must keep winning over theme blocks

## Aesthetic

- Direction: bespoke "traditional ornament" system with 3 switchable themes
- Defining trait: each theme is a full token set (shadcn semantic vars + gold/veil/app-backdrop extras) scoped on `:root:where([data-theme=...][data-theme-mode=...])`; base `:root` is the fallback so specificity stays below the a11y-contrast override (0,1,1)
- Signature move: the memorial candle ornament (SVG with a flickering flame) as the landing hero device, plus gold corner-frame accents

## Typography

- Display: Frank Ruhl Libre (serif, Hebrew+Latin) | Google Fonts | OFL
- Body: Noto Sans Hebrew (sans) | Google Fonts | OFL
- Readable (print/PDF): Frank Ruhl Libre
- Mono: not used
- Scale: base 16px | display/h1 use `--font-display`; headings serif, body sans
- Weights: 400/500/700 | Tracking: default (Hebrew, no letterspacing)

## Color

- Strategy: memorial warmth; the gold/veil/app-backdrop extras are defined per theme and consumed as `--color-gold`, `--color-gold-foreground`, `--color-veil`, `--app-backdrop`
- Distribution: 60 neutral / 30 theme color / 10 gold accent
- Theme 1 - Dusk (דמדומים, default: dark) - twilight navy, candle amber:
  - dusk dark: bg oklch(0.16 0.025 275), fg oklch(0.93 0.015 85), primary oklch(0.78 0.13 80), gold oklch(0.78 0.13 80), veil oklch(0.15 0.02 265 / 0.62), backdrop /images/Yorzait-candle-sunset.png
  - dusk light: bg oklch(0.96 0.01 85), fg oklch(0.27 0.03 265), primary oklch(0.72 0.14 80), gold oklch(0.62 0.12 70), veil oklch(0.27 0.03 265 / 0.35)
- Theme 2 - Parchment (קלף, default: light) - warm paper + ink, old gold:
  - parchment light: bg oklch(0.965 0.012 88), fg oklch(0.3 0.02 60), primary oklch(0.55 0.07 55), gold oklch(0.68 0.12 80), veil oklch(0.3 0.02 60 / 0.35), backdrop /images/magnific_subtle-marble-and-fine-ha_yi4LguxPW9.jpg
  - parchment dark: bg oklch(0.14 0.015 60), fg oklch(0.92 0.015 88), primary oklch(0.7 0.11 80), gold oklch(0.72 0.11 85), veil oklch(0.14 0.015 60 / 0.62)
- Theme 3 - Stone (אבן, default: light) - Jerusalem limestone + olive, aged gold:
  - stone light: bg oklch(0.955 0.012 95), fg oklch(0.3 0.03 130), primary oklch(0.5 0.09 165), gold oklch(0.68 0.12 85), veil oklch(0.3 0.03 130 / 0.35), backdrop /images/kadish-on-tumbe.png
  - stone dark: bg oklch(0.16 0.02 135), fg oklch(0.93 0.01 95), primary oklch(0.6 0.1 160), gold oklch(0.68 0.12 85), veil oklch(0.16 0.02 135 / 0.62)
- Links: --color-link per theme (never the old indigo) | destructive stays shadcn default
- Full per-variable values live in src/css/index.css (single source of truth for tokens, synced by theme)

## Spacing, radius, shadow

- Spacing base: 4px (Tailwind scale) | Radius: --radius 0.625rem
- Shadow approach: defined edge, minimal; the app-backdrop image carries depth, shadows stay subtle

## Layout and composition

- Grid: single column, centered (max-width wrapper), editorial vertical rhythm
- Spacing rhythm: tight-within / loose-between sections; landing hero centered on the app-backdrop
- Signature layout move: hero image behind a --veil scrim with the candle + serif title centered on top
- Density: balanced | Scanning: F (RTL: right-to-left flow)
- Responsive: mobile-first | breakpoints: Tailwind default

## Components and states

- Button hierarchy: shadcn Button; primary uses theme --primary (gold on dusk), secondary/outline available, tertiary text
- Inputs: shadcn form/input pattern (wizard), RTL aware
- Overlays: shadcn Dialog for the theme switcher (paintbrush trigger in the header); focus trap + return handled by the component
- Empty / loading / error: TanStack Query loading states; hero image picker shows current mode via aria-pressed
- Focus ring: shadcn ring token, visible

## Motion

- Duration scale: shadcn defaults; one bespoke animation: candle flame flicker (`@keyframes izkor-flame-flicker`, class `.candle-flame`, transform-origin 50% 90% fill-box)
- Easing: ease-in-out for flicker
- What animates: transform/scale/rotate of the flame only | reduced-motion: `.candle-flame { animation: none }` under `prefers-reduced-motion`; `html.a11y-stop-animations` also kills it

## Iconography

- Set: shadcn lucide (Paintbrush for theme switcher) + bespoke memorial SVG ornaments (candle)
- Ornament glyphs on the landing: '✶' '❖' '✠' '✦' (feature markers) and the OrnamentDivider '──✦──' rule

## Imagery and illustration

- Mode: art-directed AI photography/renders (one hero per theme), generated via Gemini using prompts kept in web/public/images/prompts/ (one .md per image, traceable workflow)
- Rules: full-bleed backdrop under --veil; graded toward the theme palette; must leave contrast space behind centered text (the veil guarantees text-over-image contrast)
- Avoid: glossy stock, 3D blobs, corporate Memphis, raw default-generative renders, images with readable background text
- Text-over-image contrast: --veil scrim (0.35 light / 0.62 dark) + gold foreground on dark

## Dark mode (in scope)

- Per-theme dark variants exist (see Color); base fallback :root stays light; dark defaults: dusk (default), parchment/stone default light
- Accent (dark): lighter desaturated gold; border: lighter than surface

## Accessibility

- Contrast: AA per theme (checked per theme block) | Focus: shadcn ring
- Keyboard: fully operable (dialog, theme buttons aria-pressed) | Targets: shadcn defaults
- Color independence: yes (icons + labels, not color alone) | Reduced motion: yes (flicker off) | Notes: `html.a11y-contrast` and `html.a11y-stop-animations` classes from the a11y widget must continue to override theme blocks

## Tokens (source of truth)

The token source of truth is `web/src/css/index.css`: base `:root` fallback + six `:root:where([data-theme=...][data-theme-mode=...])` blocks, shadcn vars + `--gold`, `--gold-foreground`, `--veil`, `--app-backdrop`, `--font-display`, `--font-readable`. React side: `web/src/features/theme/themes.ts` (state, storage `izkor:theme:v1`, DOM application), `theme-provider.tsx` (context), `hero-images.ts` (TanStack Query hero choice, storage `izkor:hero:v1`).

- Adapter: Tailwind v4 `@theme` (semantic tokens via `@theme inline` mapping to the CSS vars) + shadcn tokens

## Cards and surfaces

- Cards: `OrnamentFrame` (border + gold corner accents, `rounded-lg`, `border-gold/35`, subtle backdrop blur) for landing features; shadcn Card for wizard; no cards-in-cards nesting

## Slop audit

- Date: 2026-08-07 | Result: fixed
- Notes: caught and replaced the shadcn indigo/purple default (old theme-color #863bff -> #141a2e); replaced hardcoded hero background with per-theme `--app-backdrop`; hero is art-directed per theme rather than one generic stock image; ornaments limited to memorial vocabulary; flame motion honors reduced-motion and a11y-stop-animations

## Changelog

- 2026-08-07: added 3-theme system (dusk/parchment/stone) x light/dark, theme switcher dialog in header, TanStack Query hero picker (auto/pinned/random), landing redesign with candle ornament + veil-scrim hero + ornament frames, images/prompts workflow for Gemini regeneration

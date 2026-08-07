# Izkor image prompts

Every image in `web/public/images/` that was generated with a text-to-image model
has one prompt file in this folder. The workflow guarantees each image is
traceable to the prompt that produced it.

## Workflow

1. Write (or improve) the prompt file for the image you want: `N-name.md`.
   One file per image. The file contains the full Gemini prompt, the target
   filename, the theme it serves, and the palette/mood the prompt must honor.
2. Generate with Gemini (Imagen / Ultra), then download the result into
   `web/public/images/` under the exact filename from the prompt file.
3. Point the consuming code at the new file:

   - Hero images: `web/src/features/theme/hero-images.ts` (`HERO_IMAGES[].src`)
   - Theme backdrops: `web/src/css/index.css` (`--app-backdrop` per theme block)

4. Keep the prompt file in sync: if you iterated on the prompt to get the final
   image, update the file with the winning version. The file is the record of
   what produced the shipped image, not a brainstorming scratchpad.

## Rules for every prompt

- No readable text in the image (Hebrew, Latin, or otherwise): text in generated
  images always comes out garbled. Any lettering is added in code.
- Landscape, wide aspect (roughly 16:9) for full-bleed backdrop use.
- Leave the center-right zone relatively clear (RTL layout centers the hero
  title there) so the `--veil` scrim has quiet space behind the text.
- Grade toward the theme's palette (see the palette section in each file).
- No glossy stock-photo look, no 3D blobs, no corporate-flat figures, no
  default-generative "perfectly lit studio" look: aim for aged, reverent,
  natural light.

## Mapping

| Image | Theme | Prompt file |
| --- | --- | --- |
| `Yorzait-candle-sunset.png` | dusk | `01-hero-dusk-candle.md` |
| `magnific_subtle-marble-and-fine-ha_yi4LguxPW9.jpg` | parchment | `02-hero-parchment-window.md` |
| `kadish-on-tumbe.png` | stone | `03-hero-mount-olives.md` |

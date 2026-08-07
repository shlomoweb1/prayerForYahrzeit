# 03 - Stone hero: Mount of Olives at quiet dusk

- Target file: `web/public/images/kadish-on-tumbe.png`
- Theme: stone (אבן) - Jerusalem limestone + olive, aged gold, light mode default
- Current status: image exists and ships; prompt below is the regeneration
  prompt if the image is ever replaced.

## Gemini prompt

```
Create a wide landscape photograph, aspect ratio 16:9, with no text anywhere.

Subject: the Mount of Olives cemetery in Jerusalem at quiet dusk. Rows of old
limestone headstones in warm pale stone, a few olive trees, a soft hazy golden
light on the horizon. No people, no figures, no modern elements.

Mood: reverent, ancient, peaceful. Traditional Jewish cemetery atmosphere.

Style: natural light, slightly aged film photograph look, muted and desaturated
toward limestone and olive tones with aged-gold warmth. Not glossy, no lens
flares, no 3D look. Keep the upper two-thirds calm and even in tone so app text
reads there.

Palette: Jerusalem limestone oklch(0.955 0.012 95), olive green
oklch(0.3 0.03 130), aged gold oklch(0.68 0.12 85).
```

## Notes

- Used as the landing backdrop for the stone theme and as the app-backdrop in
  `src/css/index.css`.
- Text is added in code over a `--veil` scrim (olive at 0.35 opacity in light
  mode); the image itself must contain no readable text.

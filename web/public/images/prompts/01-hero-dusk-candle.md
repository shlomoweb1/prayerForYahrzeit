# 01 - Dusk hero: memorial candle at sunset

- Target file: `web/public/images/Yorzait-candle-sunset.png`
- Theme: dusk (דמדומים) - twilight navy + candle amber, dark mode default
- Current status: image exists and ships; prompt below is the regeneration
  prompt if the image is ever replaced.

## Gemini prompt

```
Create a wide landscape photograph, aspect ratio 16:9, with no text anywhere.

Subject: a single memorial candle (Jewish yahrzeit candle) burning in its glass
jar on a stone table. The glass has a thin dark paper band around its middle.
A soft, warm amber flame. Behind it, a hazy twilight sky in deep navy blue and
indigo at the horizon, the last warm glow of sunset on the horizon line.

Mood: reverent, quiet, memorial. No people.

Style: natural light, slightly aged film photograph look, muted and desaturated
toward navy and amber. Do not make it glossy, do not add lens flares or
3D-looking glow. Keep the top two-thirds of the image relatively dark and calm
(navy sky) because app text sits centered there; the candle stays in the lower
third.

Palette: twilight navy oklch(0.16 0.025 275), candle amber
oklch(0.78 0.13 80), warm embers.
```

## Notes

- Used as the landing backdrop for the dusk theme and as the app-backdrop in
  `src/css/index.css`.
- Text is added in code over a `--veil` scrim (navy at 0.62 opacity in dark
  mode); the image itself must contain no readable text.

# 02 - Parchment hero: old paper and marble

- Target file: `web/public/images/magnific_subtle-marble-and-fine-ha_yi4LguxPW9.jpg`
- Theme: parchment (קלף) - warm paper + ink, old-gold accents, light mode default
- Current status: image exists and ships; prompt below is the regeneration
  prompt if the image is ever replaced.

## Gemini prompt

```
Create a wide landscape image, aspect ratio 16:9, with no text anywhere.

Subject: an aged parchment scroll or prayer-sheet lying on fine off-white
marble. The parchment is slightly curled at the edges, warm cream with old-gold
glow, one brass corner ornament barely visible at the edge. Soft daylight from
the side, gentle shadows.

Mood: timeless, reverent, like a very old manuscript in a quiet room. No people,
no hands.

Style: warm paper tones, subtle grain, natural soft daylight. Not glossy, no
studio lighting, no lens flare, no 3D look. Keep the center of the image fairly
plain and light so app text reads over it.

Palette: warm paper oklch(0.965 0.012 88), ink brown oklch(0.3 0.02 60),
old gold oklch(0.68 0.12 80).
```

## Notes

- Used as the landing backdrop for the parchment theme and as the app-backdrop
  in `src/css/index.css`.
- Text is added in code over a `--veil` scrim (warm brown at 0.35 opacity in
  light mode); the image itself must contain no readable text.

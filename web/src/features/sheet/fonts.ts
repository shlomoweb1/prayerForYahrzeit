/**
 * Font registry for yahrzeit sheets (driven by data/fonts-manifest.json).
 *
 * Every family file lives in web/public/fonts/<family>/ and is committed with
 * its license. The @font-face rules below are appended to index.css; the
 * render worker rewrites their url(/fonts/…) sources to data URIs at PDF
 * render time (see features/folio/font-embedder).
 */

import type { SheetFontId } from '@/features/sheet/layout'

export interface SheetFontDef {
  id: SheetFontId
  /** CSS font-family name used by the sheet. */
  cssFamily: string
  /** Files under /fonts/<dir>/ ; weight maps the font-weight used in CSS. */
  files: { dir: string; file: string; weight: number; style: string }[]
}

export const SHEET_FONTS: Record<SheetFontId, SheetFontDef> = {
  'noto-serif': {
    id: 'noto-serif',
    cssFamily: 'Noto Serif Hebrew',
    files: [
      { dir: 'NotoSerifHebrew', file: 'regular-full.ttf', weight: 400, style: 'normal' },
      { dir: 'NotoSerifHebrew', file: 'bold-full.ttf', weight: 700, style: 'normal' },
    ],
  },
  'noto-sans': {
    id: 'noto-sans',
    cssFamily: 'Noto Sans Hebrew',
    files: [
      { dir: 'NotoSansHebrew', file: 'regular-full.ttf', weight: 400, style: 'normal' },
      { dir: 'NotoSansHebrew', file: 'bold-full.ttf', weight: 700, style: 'normal' },
    ],
  },
  rashi: {
    id: 'rashi',
    cssFamily: 'Noto Rashi Hebrew',
    files: [
      { dir: 'NotoRashiHebrew', file: 'regular-full.ttf', weight: 400, style: 'normal' },
      { dir: 'NotoRashiHebrew', file: 'bold-full.ttf', weight: 700, style: 'normal' },
    ],
  },
  'frank-ruhl': {
    id: 'frank-ruhl',
    cssFamily: 'Frank Ruhl Libre',
    files: [
      { dir: 'FrankRuhlLibre', file: 'regular-full.ttf', weight: 400, style: 'normal' },
      { dir: 'FrankRuhlLibre', file: 'bold-full.ttf', weight: 700, style: 'normal' },
    ],
  },
  taamey: {
    id: 'taamey',
    cssFamily: 'Taamey Frank CLM',
    files: [
      { dir: 'TaameyFrankCLM', file: 'medium-full.ttf', weight: 400, style: 'normal' },
      { dir: 'TaameyFrankCLM', file: 'bold-full.ttf', weight: 700, style: 'normal' },
    ],
  },
  keter: {
    id: 'keter',
    cssFamily: 'Keter YG',
    files: [
      { dir: 'KeterYG', file: 'medium-full.ttf', weight: 400, style: 'normal' },
      { dir: 'KeterYG', file: 'bold-full.ttf', weight: 700, style: 'normal' },
    ],
  },
}

export function fontDef(fontId: SheetFontId): SheetFontDef {
  return SHEET_FONTS[fontId]
}

/** @font-face CSS block for a family (used in the app stylesheet). */
export function fontFaceCss(fontId: SheetFontId): string {
  const def = fontDef(fontId)
  return def.files
    .map(
      (f) =>
        `@font-face{font-family:'${def.cssFamily}';font-style:${f.style};` +
        `font-weight:${f.weight};font-display:swap;` +
        `src:url('/fonts/${f.dir}/${f.file}') format('truetype');}`,
    )
    .join('\n')
}

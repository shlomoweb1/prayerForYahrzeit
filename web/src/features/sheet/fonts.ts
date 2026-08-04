/**
 * Font registry for yahrzeit sheets.
 *
 * The data (family/files/weights) is generated at dev/build time by
 * web/vite-plugins/sheet-fonts.ts from data/sheet-fonts.json (curation) and
 * data/fonts-manifest.json (provenance) — see that plugin to add a font. The
 * same data also produces src/css/generated/sheet-fonts.css (@font-face rules
 * + Tailwind font-<id> theme vars), imported by the print preview stylesheet.
 *
 * `ALL_FONT_FACES_CSS` below is built from this registry rather than reading
 * that generated CSS file, because the off-screen capture used for PDF
 * rendering is a standalone document with no access to the app's linked
 * stylesheets (see sheet-document.tsx) — it needs the @font-face text as a JS
 * string it can inline directly.
 */
import { SHEET_FONT_IDS } from '@/features/sheet/generated/sheet-font-ids'
import fontsData from '@/features/sheet/generated/sheet-fonts.json'

export type SheetFontId = (typeof SHEET_FONT_IDS)[number]

export interface SheetFontDef {
  id: SheetFontId
  /** CSS font-family name used by the sheet. */
  cssFamily: string
  /** Files under /fonts/<dir>/ ; weight maps the font-weight used in CSS. */
  files: { dir: string; file: string; weight: number; style: string }[]
}

export const SHEET_FONTS = fontsData as Record<SheetFontId, SheetFontDef>

export function fontDef(fontId: SheetFontId): SheetFontDef {
  return SHEET_FONTS[fontId]
}

/** @font-face rules for every sheet font, for standalone (capture) documents. */
export const ALL_FONT_FACES_CSS: string = Object.values(SHEET_FONTS)
  .flatMap((def) =>
    def.files.map(
      (f) =>
        `@font-face{font-family:'${def.cssFamily}';font-style:${f.style};` +
        `font-weight:${f.weight};font-display:swap;` +
        `src:url('/fonts/${f.dir}/${f.file}') format('truetype');}`,
    ),
  )
  .join('\n')

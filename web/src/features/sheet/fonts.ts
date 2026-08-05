/**
 * Font registry for yahrzeit sheets.
 *
 * The data (family/files/weights) is generated at dev/build time by
 * web/vite-plugins/sheet-fonts.ts from data/sheet-fonts.json (curation) and
 * data/fonts-manifest.json (provenance) — see that plugin to add a font. The
 * same data also produces src/css/generated/sheet-fonts.css (@font-face rules
 * + Tailwind font-<id> theme vars), imported by the print preview stylesheet.
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

/**
 * Lazy, per-font base64 data URIs (`{ file: dataUri }`), precomputed at
 * build time by sheet-fonts.ts from the same /fonts/<dir>/<file> bytes the
 * browser @font-face rules point at (see generated/font-data/<id>.ts). Only
 * the fonts a render actually asks for are ever fetched — `import.meta.glob`
 * code-splits each id into its own chunk, cached by the browser after first
 * use.
 *
 * The Folio PDF capture needs these as data URIs (not `url(/fonts/...)`)
 * because the wasm worker can't resolve a relative URL itself — see
 * renderSheetHTML.tsx.
 */
const fontDataModules = import.meta.glob<{ default: Record<string, string> }>(
  './generated/font-data/*.ts',
)

export async function loadFontFaceData(fontId: SheetFontId): Promise<Record<string, string>> {
  const load = fontDataModules[`./generated/font-data/${fontId}.ts`]
  if (!load) throw new Error(`no font data module for "${fontId}"`)
  return (await load()).default
}

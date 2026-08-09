/**
 * P3-01 SheetLayout model.
 *
 * Single source of truth for the sheet geometry: the same layout object feeds
 * the live preview, the off-screen capture and the Folio @page CSS, so the
 * preview and the generated PDF can never drift.
 *
 * All pixel values are CSS px at 96 dpi (1 mm = 96 / 25.4 px).
 */

import type { SheetFontId } from '@/features/sheet/fonts'

export type { SheetFontId }

export const SHEET_SECTIONS = [
  'psalms',
  'neshama',
  'kaddish',
  'mishnayot',
  'hashkava',
  'closing',
] as const

export type SheetSectionToggle = (typeof SHEET_SECTIONS)[number]

export type SheetPaper = 'a4' | 'letter'
/** נוסח אשכנז, נוסח ספרד (the Chassidic/Israeli variant of the Ashkenazi
 * rite — resolved to the ashkenaz texts with per-line variant swaps), and
 * עדות המזרח. */
export type SheetNusach = 'ashkenaz' | 'ashkenazSefard' | 'sefard'
export type SheetGender = 'male' | 'female'
export type SheetLineage = 'none' | 'kohen' | 'levi'
export type AcrosticMode = 'both' | 'name' | 'parent' | 'none'
export type HashkavaVariant = 'elMaleh' | 'traditional' | 'both'
/** How the congregation's response lines are labeled in the printed קדיש:
 * "(הקהל: ...)", "(עונים: ...)", or unlabeled (the response text still
 * prints, just without the parenthesized cue). */
export type KaddishResponseLabel = 'congregation' | 'responders' | 'none'
/** Which wording אל מלא רחמים gives for why the deceased deserves rest —
 * the traditional "charity was donated in their memory" clause, or a
 * "psalms were recited for the elevation of their soul" alternative. */
export type ElMalehPhrase = 'charity' | 'psalms'

/** Line-height density presets — the "compact vs airy" control. `normal` is
 * the tuned print default from the compact-layout pass. */
export type LineDensity = 'tidy' | 'normal' | 'loose'

export const LINE_DENSITY_MULTIPLIER: Record<LineDensity, number> = {
  tidy: 0.87,
  normal: 1,
  loose: 1.15,
}

/**
 * Every visually distinct element of the sheet that can carry its own font.
 * Each one falls back to the global `SheetSettings.font` unless overridden
 * via its matching `fontXxx` WizardQuery key (`font` + PascalCase(element)).
 * Listed in the order they appear on the sheet; the advanced font panel
 * groups them under the same headings the sheet itself uses.
 */
export const SHEET_ELEMENT_FONTS = [
  'bsd',
  'sheetTitle',
  'nameLine',
  'sectionTitle',
  'psalmBadge',
  'psalmText',
  'letterBadge',
  'letterText',
  'kaddishMourner',
  'kaddishCongregation',
  'mishnahBadge',
  'mishnahText',
  'blessingText',
  'elMalehText',
  'hashkavaText',
  'closingDryBones',
  'closingAvHaRachamim',
  'closingParting',
] as const

export type SheetElementFont = (typeof SHEET_ELEMENT_FONTS)[number]

/** Every sheet element's resolved font (overrides applied, global fallback). */
export type SheetElementFonts = Record<SheetElementFont, SheetFontId>

/** All 18 sheet elements set to one font — the default settings/tests start
 * from (overrides applied later via the fontXxx query keys). */
export function defaultElementFonts(font: SheetFontId): SheetElementFonts {
  const fonts = {} as SheetElementFonts
  for (const element of SHEET_ELEMENT_FONTS) {
    fonts[element] = font
  }
  return fonts
}

/** Settings consumed by the layout/content model (subset of WizardQuery). */
export interface SheetSettings {
  paper: SheetPaper
  gender: SheetGender
  nusach: SheetNusach
  name?: string
  parent?: string
  /** Hebrew calendar absolute day (R.D.) of passing — see `WizardQuery.deathDate`. */
  deathDate?: number
  lineage: SheetLineage
  font: SheetFontId
  /** Resolved per-element fonts: each equals `font` unless overridden. */
  fonts: SheetElementFonts
  lineDensity: LineDensity
  nikud: number
  deco: number
  acrostic: AcrosticMode
  blessing: number
  hashkavaVariant: HashkavaVariant
  kaddishResponseLabel: KaddishResponseLabel
  elMalehPhrase: ElMalehPhrase
  sections: SheetSectionToggle[]
}

export const MM_TO_PX = 96 / 25.4

export interface SheetPageSpec {
  /** Paper width in px @96dpi. */
  widthPx: number
  /** Paper height in px @96dpi. */
  heightPx: number
  /** Folio @page CSS (overrides the pageSize fallback). */
  pageCss: string
  /** Machine label (a4 | letter). */
  label: SheetPaper
}

export interface SheetLayout {
  paper: SheetPaper
  page: SheetPageSpec
  /** Base body font size in px (print ≈ 10.5–11 pt). */
  baseFontPx: number
  /** Line-height multiplier for body text. */
  lineHeight: number
  /** Horizontal margin in px (print 12–15 mm). */
  marginX: number
  /** Vertical margin in px. */
  marginY: number
  /** Decoration scale: big-letter size relative to the word body. */
  decoScale: number
  /** Sheet title (header) font size in px. */
  titleFontPx: number
  /** Section heading font size in px. */
  headingFontPx: number
  /** CSS font-family registered via @font-face. */
  fontFamily: string
  fontId: SheetFontId
}

export function a4PageSpec(): SheetPageSpec {
  return {
    // Not rounded to a whole pixel: this value is also what the exported
    // HTML declares as `[data-page]`'s inline `height`, which Folio (the
    // PDF renderer) lays out content into and then places onto an actual
    // A4 page of exactly 841.89pt (297mm precisely, no px round-trip —
    // see document.PageSizeA4 in go-html-to-pdf). Rounding 297mm to a
    // whole CSS px first (1123px = 842.25pt) makes the declared page
    // *taller* than the real page it lands on by ~0.36pt — invisible
    // for most content, but on a page whose content fills the budget to
    // within a fraction of a point (this app tunes its layout right up
    // to the edge), that 0.36pt is enough to push it onto an extra page
    // in Folio's own output even though the live preview shows it
    // fitting fine. Kept unrounded so pagination decisions (useSheetPagePlan
    // measures against this same value) target Folio's true page size
    // from the start, per this file's "single source of truth" contract.
    widthPx: 210 * MM_TO_PX,
    heightPx: 297 * MM_TO_PX,
    pageCss: '@page{size:210mm 297mm;margin:0;}',
    label: 'a4',
  }
}

export function letterPageSpec(): SheetPageSpec {
  return {
    widthPx: Math.round(216 * MM_TO_PX),
    heightPx: 1056,
    pageCss: '@page{size:216mm 279mm;margin:0;}',
    label: 'letter',
  }
}

export function paperPageSpec(paper: SheetPaper): SheetPageSpec {
  return paper === 'a4' ? a4PageSpec() : letterPageSpec()
}

/**
 * Print defaults: base ≈ 10.5–11 pt (14–14.7 px), margins 12–15 mm.
 *
 * Compact/legible pass: `lineHeight` was tightened from 1.7 to 1.45 (less
 * page-burning air between lines that doesn't help reading) while
 * `baseFontPx` was nudged to the top of the allowed pt range and a touch of
 * letter/word-spacing was added in sheet CSS for contrast at arm's length in
 * bright sun — the two changes roughly cancel out on line count but improve
 * legibility. `lineHeight` here is the `normal` density; `tidy`/`loose` scale
 * it via `LINE_DENSITY_MULTIPLIER`.
 */
export function printLayoutDefaults(paper: SheetPaper): SheetLayout {
  const page = paperPageSpec(paper)
  return {
    paper,
    page,
    baseFontPx: 14.7,
    lineHeight: 1.45,
    marginX: Math.round(12 * MM_TO_PX),
    marginY: Math.round(12 * MM_TO_PX),
    decoScale: 1.9,
    titleFontPx: 23,
    headingFontPx: 15,
    fontFamily: 'Noto Serif Hebrew',
    fontId: 'noto-serif',
  }
}

export interface BuildLayoutOptions {
  lineDensity?: LineDensity
}

export function buildLayout(
  paper: SheetPaper,
  fontId: SheetFontId,
  options: BuildLayoutOptions = {},
): SheetLayout {
  const base = printLayoutDefaults(paper)
  const density = options.lineDensity ?? 'normal'
  const lineHeight = base.lineHeight * LINE_DENSITY_MULTIPLIER[density]
  return { ...base, fontId, lineHeight }
}

/** Horizontal content width available for text (page minus margins). */
export function contentWidth(layout: SheetLayout): number {
  return layout.page.widthPx - layout.marginX * 2
}

/** Vertical content height available per page (page minus margins). */
export function contentHeight(layout: SheetLayout): number {
  return layout.page.heightPx - layout.marginY * 2
}

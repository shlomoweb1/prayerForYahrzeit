/**
 * P3-01 SheetLayout model.
 *
 * Single source of truth for the sheet geometry: the same layout object feeds
 * the live preview, the off-screen capture and the Folio @page CSS, so the
 * preview and the generated PDF can never drift.
 *
 * All pixel values are CSS px at 96 dpi (1 mm = 96 / 25.4 px).
 */

export const SHEET_SECTIONS = [
  'psalms',
  'neshama',
  'kaddish',
  'mishnayot',
  'hashkava',
  'closing',
] as const

export type SheetSectionToggle = (typeof SHEET_SECTIONS)[number]

export type SheetTarget = 'print' | 'share' | 'both'
export type SheetPaper = 'a4' | 'letter'
export type SheetNusach = 'ashkenaz' | 'sefard'
export type SheetGender = 'male' | 'female'
export type SheetLineage = 'none' | 'kohen' | 'levi'
export type AcrosticMode = 'both' | 'name' | 'parent' | 'none'
export type SheetFontId =
  | 'noto-serif'
  | 'noto-sans'
  | 'rashi'
  | 'frank-ruhl'
  | 'taamey'
  | 'keter'

/** Settings consumed by the layout/content model (subset of WizardQuery). */
export interface SheetSettings {
  paper: SheetPaper
  gender: SheetGender
  nusach: SheetNusach
  name?: string
  parent?: string
  lineage: SheetLineage
  font: SheetFontId
  nikud: number
  deco: number
  acrostic: AcrosticMode
  blessing: number
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
  /** Machine label (a4 | letter | share). */
  label: SheetPaper | 'share'
}

export interface SheetLayout {
  target: 'print' | 'share'
  paper: SheetPaper
  page: SheetPageSpec
  /** Base body font size in px (print ≈ 10.5–11 pt, share ≈ 15–16 pt). */
  baseFontPx: number
  /** Line-height multiplier for body text. */
  lineHeight: number
  /** Horizontal margin in px (print 12–15 mm, share ≈ 10 mm). */
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
    widthPx: Math.round(210 * MM_TO_PX),
    heightPx: Math.round(297 * MM_TO_PX),
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

export function sharePageSpec(): SheetPageSpec {
  return {
    widthPx: 1080,
    heightPx: 1920,
    pageCss: '@page{size:1080px 1920px;margin:0;}',
    label: 'share',
  }
}

export function paperPageSpec(paper: SheetPaper): SheetPageSpec {
  return paper === 'a4' ? a4PageSpec() : letterPageSpec()
}

/** Print defaults: base ≈ 10.5–11 pt (14–14.7 px), margins 12–15 mm. */
export function printLayoutDefaults(paper: SheetPaper): SheetLayout {
  const page = paperPageSpec(paper)
  return {
    target: 'print',
    paper,
    page,
    baseFontPx: 14,
    lineHeight: 1.7,
    marginX: Math.round(13 * MM_TO_PX),
    marginY: Math.round(13 * MM_TO_PX),
    decoScale: 1.9,
    titleFontPx: 24,
    headingFontPx: 16,
    fontFamily: 'Noto Serif Hebrew',
    fontId: 'noto-serif',
  }
}

/** Share defaults: base ≈ 15–16 pt (20–21.3 px), margins ≈ 10 mm. */
export function shareLayoutDefaults(): SheetLayout {
  return {
    target: 'share',
    paper: 'a4',
    page: sharePageSpec(),
    baseFontPx: 20,
    lineHeight: 1.75,
    marginX: Math.round(11 * MM_TO_PX),
    marginY: Math.round(13 * MM_TO_PX),
    decoScale: 1.8,
    titleFontPx: 34,
    headingFontPx: 24,
    fontFamily: 'Noto Serif Hebrew',
    fontId: 'noto-serif',
  }
}

export function buildLayout(
  target: 'print' | 'share',
  paper: SheetPaper,
  fontId: SheetFontId,
): SheetLayout {
  const base = target === 'print' ? printLayoutDefaults(paper) : shareLayoutDefaults()
  return { ...base, fontId }
}

/** Horizontal content width available for text (page minus margins). */
export function contentWidth(layout: SheetLayout): number {
  return layout.page.widthPx - layout.marginX * 2
}

/** Vertical content height available per page (page minus margins). */
export function contentHeight(layout: SheetLayout): number {
  return layout.page.heightPx - layout.marginY * 2
}

/**
 * Typed accessor over data/liturgy.json (itim.org.il harvest, offline).
 * Liturgy strings keep their <b>/<br> markup; block splitting drives
 * pagination granularity for the long prayer texts.
 */

import raw from '../../data/liturgy.json'

import { normalizePunctuation, stripNikud } from '@/lib/hebrew'
import type { SheetNusach } from '@/features/sheet/layout'

export interface PrayersBeforeBlock {
  title: string
  content: string
}

export interface NusachTextsData {
  prayersBefore: PrayersBeforeBlock[]
  kaddishYatom: string
  kaddishDerabanan: string
  kaddishDeAtchadta: string | null
  hashkava: string
  closingPrayers: string
}

export interface LiturgyData {
  fixedPsalms: number[]
  letterPsalms: Record<string, { title: string; content: string }>
  neshamaLetters: string[]
  sofitMap: Record<string, string>
  nusach: Record<'ashkenaz' | 'sepharad', NusachTextsData>
}

export const liturgyData = raw as LiturgyData

/** The 7 fixed psalms: לג טז יז עב צא קד קל. */
export const FIXED_PSALMS: readonly number[] = liturgyData.fixedPsalms

/** The letters of נשמה (fallback acrostic when no parent name is given). */
export const NESHAMA_LETTERS: readonly string[] = liturgyData.neshamaLetters

/** Map nusach keys to the data keys ('sefard' -> 'sepharad'). */
export function nusachTexts(nusach: SheetNusach): NusachTextsData {
  return nusach === 'sefard' ? liturgyData.nusach.sepharad : liturgyData.nusach.ashkenaz
}

/**
 * Split a liturgy HTML string into display blocks at <br><br> boundaries.
 * Each block stays a single pagination unit.
 */
export function splitBlocks(html: string): string[] {
  return html
    .split(/<br\s*\/?>\s*<br\s*\/?>/gi)
    .map((block) => block.trim())
    .filter((block) => block.length > 0)
}

/**
 * קדיש דרבנן + קדיש דאתחדתא: the ashkenaz harvest split the two prayers at
 * <br><br> with a <b> tag straddling the boundary, so concatenation yields
 * well-formed markup again. Sepharad has no de-atchadta variant.
 */
export function kaddishDerabananCombined(nusach: SheetNusach): string {
  const texts = nusachTexts(nusach)
  return texts.kaddishDerabanan + (texts.kaddishDeAtchadta ?? '')
}

export interface LiturgyRenderText {
  /** Block HTML with <b>/<br> markup, punctuation normalized. */
  html: string
}

/** Normalize a liturgy block for the sheet (quotes -> geresh, optional nikud strip). */
export function liturgyBlockHtml(block: string, opts?: { nikud?: boolean }): string {
  let html = normalizePunctuation(block)
  if (!opts?.nikud) html = stripNikud(html)
  return html
}

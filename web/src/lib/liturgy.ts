/**
 * Typed accessor over data/liturgy.json (itim.org.il harvest, offline).
 * Liturgy strings keep their <b>/<br> markup; block splitting drives
 * pagination granularity for the long prayer texts.
 */

import raw from '../../../data/liturgy.json'

import { normalizePunctuation, stripNikud } from '@/lib/hebrew'
import type { SheetGender, SheetNusach } from '@/features/sheet/layout'

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
  elMaleRachamim: { male: string; female: string }
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

/**
 * קדיש יתום: the harvest puts a single <br> between every speaker cue
 * (האבלים: / הקהל: / etc.), which renders each cue on its own line — reading
 * like a script instead of flowing liturgical text. This flattens it into
 * one continuous paragraph, with per-speaker handling:
 *
 * - Mourners' lines (האבלים:) lose the label entirely and just flow — the
 *   label would otherwise repeat before nearly every line, which is the
 *   thing this rewrite exists to fix.
 * - Congregation lines (הקהל:) keep their label but become a small
 *   parenthesized inline aside — "(הקהל: אמן)" — right where the line
 *   occurred, via the `.izkor-rubric` CSS hook (see sheet-css.ts).
 * - The one line spoken jointly ("הקהל והאבלים: יהא שמה רבא...") is left
 *   alone on its own paragraph (wrapped in <br><br> so it becomes its own
 *   pagination block via splitBlocks(), same as a normal paragraph break) —
 *   its label only appears once, so there's no repetition to fix there.
 *
 * The Ashkenaz harvest also has one spot that wrote the congregation cue as
 * "קהל:" (missing the ה) — normalized to "הקהל:" before classification so it
 * gets the same rubric treatment as every other congregation line.
 */
export function kaddishYatomText(nusach: SheetNusach): string {
  const MOURNERS = 'האבלים:'
  const CONGREGATION = 'הקהל:'
  const JOINT = 'הקהל והאבלים:'

  const lines = nusachTexts(nusach)
    .kaddishYatom.split(/<br\s*\/?>/i)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => (line.startsWith('קהל:') ? `ה${line}` : line))

  const parts = lines.map((line) => {
    if (line.startsWith(JOINT)) return `<br><br><b>${line}</b><br><br>`
    // Unquoted class attribute on purpose: this markup still passes through
    // liturgyBlockHtml -> normalizePunctuation, which blindly rewrites every
    // ASCII " and ' in the string (Hebrew gershayim/geresh normalization) —
    // quoting the attribute would have it mangled into class=״izkor-rubric״.
    if (line.startsWith(CONGREGATION)) return `<span class=izkor-rubric>(${line})</span>`
    if (line.startsWith(MOURNERS)) return line.slice(MOURNERS.length).trim()
    return line
  })

  return parts
    .join(' ')
    .trim()
    .replace(/^<br\s*\/?>\s*<br\s*\/?>\s*/i, '')
    .replace(/\s*<br\s*\/?>\s*<br\s*\/?>$/i, '')
}

/** אל מלא רחמים: the [פלוני בן פלוני] / [פלונית בת פלוני] placeholder replaced with the real name phrase, bolded. */
export function elMaleRachamimText(gender: SheetGender, namePhrase: string): string {
  const template = gender === 'female' ? liturgyData.elMaleRachamim.female : liturgyData.elMaleRachamim.male
  const placeholder = gender === 'female' ? '[פלונית בת פלוני]' : '[פלוני בן פלוני]'
  return template.replace(placeholder, `<b>${namePhrase}</b>`)
}

/**
 * Traditional השכבה text: the itim harvest concatenates a shared short
 * blessing, both a male and a female full version, and a closing custom note
 * as one string — this picks the matching gender's full version and
 * substitutes its name placeholder instead of printing both versions with
 * the placeholder still literal.
 */
export function hashkavaTraditionalText(nusach: SheetNusach, gender: SheetGender, namePhrase: string): string {
  const [short, maleFull, femaleFull, closing] = nusachTexts(nusach).hashkava.split(
    /<br\s*\/?>\s*<br\s*\/?>/i,
  )
  const shortResolved = (short ?? '')
    .replace('(פב"פ)', namePhrase)
    // "תניחנו (לאשה - תניחנה)" — pick the word matching gender, drop the annotation.
    .replace(/(\S+)\s*\(לאשה\s*-\s*(\S+)\)/, gender === 'female' ? '$2' : '$1')
  const fullResolved = (gender === 'female' ? femaleFull : maleFull)
    ?.replace(gender === 'female' ? '(פלונית)' : '(פלוני)', namePhrase)
    .trim()
  return [shortResolved.trim(), fullResolved, closing?.trim()].filter(Boolean).join('<br><br>')
}

/**
 * Typed accessor over data/liturgy.json (itim.org.il harvest, offline).
 * Liturgy strings keep their <b>/<br> markup; block splitting drives
 * pagination granularity for the long prayer texts.
 */

import raw from '../../../data/liturgy.json'

import { normalizePunctuation, stripNikud } from '@/lib/hebrew'
import type { ElMalehPhrase, SheetGender, SheetNusach } from '@/features/sheet/layout'

export interface PrayersBeforeBlock {
  title: string
  content: string
}

/**
 * Who speaks a kaddish line, as labeled in the harvest's speaker cues
 * (האבלים / הקהל / הקהל והאבלים). The labels themselves are a rendering
 * concern - the data only carries the role, so the layout can style and
 * label each speaker independently (see the kaddish-section rendering).
 * `note` is a printing rubric - e.g. "(האומרים קדיש פוסעים שלוש פסיעות
 * לאחור)" - rendered before the exchange it annotates.
 */
export type KaddishSpeaker = 'mourner' | 'congregation' | 'joint' | 'note'

/** One kaddish line: the speaker role and the pure text (no markup). */
export interface KaddishLine {
  speaker: KaddishSpeaker
  text: string
  /** Alternate text for the נוסח ספרד variant of the ashkenaz rite - carried
   * only by the lines that differ (the בעלמא line's פורקנא/משיחא insertion). */
  sefardVariant?: string
}

export interface NusachTextsData {
  prayersBefore: PrayersBeforeBlock[]
  /** קדיש יתום as structured speaker-labeled lines (the layout groups them
   * into mourner-line + response sections at render time). */
  kaddishYatom: KaddishLine[]
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
  /** `male`/`female` carry a `[בעבור]` placeholder in place of the "why the
   * deceased deserves rest" clause - `reasonPhrases` supplies the wording
   * for each `ElMalehPhrase` option, per gender. */
  elMaleRachamim: {
    male: string
    female: string
    reasonPhrases: Record<ElMalehPhrase, { male: string; female: string }>
  }
}

export const liturgyData = raw as LiturgyData

/** The 7 fixed psalms: לג טז יז עב צא קד קל. */
export const FIXED_PSALMS: readonly number[] = liturgyData.fixedPsalms

/** The letters of נשמה (fallback acrostic when no parent name is given). */
export const NESHAMA_LETTERS: readonly string[] = liturgyData.neshamaLetters

/** Map nusach keys to the data keys. נוסח ספרד ('ashkenazSefard') is the
 * ashkenaz rite with its per-line variant texts (KaddishLine.sefardVariant)
 * swapped in - the two share everything else. */
export function nusachTexts(nusach: SheetNusach): NusachTextsData {
  if (nusach === 'sefard') return liturgyData.nusach.sepharad
  const base = liturgyData.nusach.ashkenaz
  if (nusach === 'ashkenazSefard') {
    return {
      ...base,
      kaddishYatom: base.kaddishYatom.map((line) =>
        line.sefardVariant ? { ...line, text: line.sefardVariant } : line,
      ),
    }
  }
  return base
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

/** אל מלא רחמים: the [פלוני בן פלוני] / [פלונית בת פלוני] placeholder
 * replaced with the real name phrase (bolded), and the [בעבור] placeholder
 * replaced with the chosen reason-for-rest wording (charity donated vs.
 * psalms recited), per gender. */
export function elMaleRachamimText(gender: SheetGender, namePhrase: string, phrase: ElMalehPhrase): string {
  const template = gender === 'female' ? liturgyData.elMaleRachamim.female : liturgyData.elMaleRachamim.male
  const placeholder = gender === 'female' ? '[פלונית בת פלוני]' : '[פלוני בן פלוני]'
  const reason = liturgyData.elMaleRachamim.reasonPhrases[phrase][gender]
  return template.replace(placeholder, `<b>${namePhrase}</b>`).replace('[בעבור]', reason)
}

/**
 * Traditional השכבה text: the itim harvest concatenates a shared short
 * blessing, both a male and a female full version, and a closing custom note
 * as one string - this picks the matching gender's full version and
 * substitutes its name placeholder instead of printing both versions with
 * the placeholder still literal.
 */
export function hashkavaTraditionalText(nusach: SheetNusach, gender: SheetGender, namePhrase: string): string {
  const [short, maleFull, femaleFull, closing] = nusachTexts(nusach).hashkava.split(
    /<br\s*\/?>\s*<br\s*\/?>/i,
  )
  const shortResolved = (short ?? '')
    .replace('(פב"פ)', namePhrase)
    // "תניחנו (לאשה - תניחנה)" - pick the word matching gender, drop the annotation.
    .replace(/(\S+)\s*\(לאשה\s*-\s*(\S+)\)/, gender === 'female' ? '$2' : '$1')
  const fullResolved = (gender === 'female' ? femaleFull : maleFull)
    ?.replace(gender === 'female' ? '(פלונית)' : '(פלוני)', namePhrase)
    .trim()
  return [shortResolved.trim(), fullResolved, closing?.trim()].filter(Boolean).join('<br><br>')
}

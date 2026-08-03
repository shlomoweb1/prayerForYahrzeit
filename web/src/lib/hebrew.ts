/**
 * Hebrew text helpers shared by the data accessors and the sheet content
 * builder.
 *
 * Glyph-coverage note: the committed sheet fonts are Hebrew-script subsets.
 * The Noto families carry no ASCII punctuation, so sheet text normalizes
 * ASCII quotes to Hebrew geresh/gershayim and verse-ending colons to the
 * sof-pasuq (׃), which every committed family contains.
 */

/** Nikud + cantillation range (per plans/03-data-pipeline.md). */
export const NIKUD_RE = /[\u0591-\u05C7]/g

export function stripNikud(text: string): string {
  return text.replace(NIKUD_RE, '')
}

/** ASCII double quote -> Hebrew gershayim (״), single quote -> geresh (׳). */
export function normalizePunctuation(text: string): string {
  return text.replace(/"/g, '\u05F4').replace(/'/g, '\u05F3')
}

/** Verse-ending colon -> sof pasuq (׃), the traditional verse separator. */
export function sofPasuq(text: string): string {
  return text.replace(/:/g, '\u05C3')
}

export function isHebrewLetter(ch: string): boolean {
  const code = ch.codePointAt(0)
  if (code === undefined) return false
  return (
    (code >= 0x05d0 && code <= 0x05ea) ||
    code === 0x05da || // ך
    code === 0x05dd || // ם
    code === 0x05df || // ן
    code === 0x05e3 || // ף
    code === 0x05e5 // ץ
  )
}

const HEBREW_DIGITS = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י'] as const
const HEBREW_TENS = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'] as const
const HEBREW_HUNDREDS = ['', 'ק', 'ר', 'ש', 'ת'] as const

/**
 * Integer (1-499) to Hebrew numeral with geresh/gershayim, e.g. 33 -> ל״ג,
 * 16 -> ט״ז, 7 -> ז׳. Numbers outside the range fall back to the raw digits.
 */
export function hebrewNumeral(n: number): string {
  if (!Number.isInteger(n) || n <= 0 || n >= 500) return String(n)
  if (n === 15) return 'ט״ו'
  if (n === 16) return 'ט״ז'
  const hundreds = Math.floor(n / 100)
  const rest = n % 100
  const tens = Math.floor(rest / 10)
  const units = rest % 10
  const body = HEBREW_HUNDREDS[hundreds]! + HEBREW_TENS[tens]! + HEBREW_DIGITS[units]!
  if (body.length === 1) return body + '\u05F3'
  return body.slice(0, -1) + '\u05F4' + body.slice(-1)
}

const segmenter =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? new Intl.Segmenter('he', { granularity: 'grapheme' })
    : null

/** Split a word into its first grapheme cluster (letter + its nikud) and the rest. */
export function splitFirstCluster(word: string): [string, string] {
  if (!segmenter) {
    if (word.length <= 1) return [word, '']
    return [word[0]!, word.slice(1)]
  }
  const parts = Array.from(segmenter.segment(word), (s) => s.segment)
  if (parts.length <= 1) return [word, '']
  return [parts[0]!, parts.slice(1).join('')]
}

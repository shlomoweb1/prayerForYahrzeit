/**
 * Typed accessor over data/letter-index.json + data/mishnayot-map.json:
 * name -> acrostic letters (sofit mapping, dedupe), psalm-119 stanzas and
 * per-letter mishnah references (from the itim harvest).
 */

import letterRaw from '../../../data/letter-index.json'
import mishnayotRaw from '../../../data/mishnayot-map.json'

import { isHebrewLetter, stripNikud } from '@/lib/hebrew'

export interface Psalm119Stanza {
  letter: string
  chapter: number
  verseIds: number[]
  firstVerseId: number
}

export interface LetterIndexData {
  alphabet: string[]
  sofitMap: Record<string, string>
  psalm119: {
    chapter: number
    stanzaSize: number
    stanzas: Record<string, Psalm119Stanza>
  }
  psalmStarters: Record<string, number[]>
}

export interface MishnahEntry {
  source: string
  tractate: string
  chapter: string
  chapterNumber: number
  text: string
}

export interface MishnayotData {
  letters: Record<string, MishnahEntry>
  neshamaLetters: string[]
  sofitMap: Record<string, string>
}

export const letterIndexData = letterRaw as LetterIndexData
export const mishnayotData = mishnayotRaw as MishnayotData

const SOFIT_MAP: Record<string, string> = {
  ...letterIndexData.sofitMap,
  ...mishnayotData.sofitMap,
}

export interface NameLetter {
  /** Letter as it actually appears in the name — final forms kept as-is. */
  display: string
  /** Regular-form letter to look up psalm-119 stanzas / mishnayot by — the
   * data is only keyed by the 22 regular letters, never final forms. */
  lookup: string
}

/**
 * Letters of a Hebrew name: nikud stripped, duplicates removed keeping first
 * order (deduped by the regular-form letter, so a name with both a final and
 * regular form of the same letter only gets one stanza).
 */
export function resolveNameLetters(name: string): NameLetter[] {
  const seen = new Set<string>()
  const letters: NameLetter[] = []
  for (const ch of stripNikud(name)) {
    const lookup = SOFIT_MAP[ch] ?? ch
    if (!isHebrewLetter(lookup)) continue
    if (seen.has(lookup)) continue
    seen.add(lookup)
    letters.push({ display: ch, lookup })
  }
  return letters
}

export function psalm119Stanza(letter: string): Psalm119Stanza | undefined {
  return letterIndexData.psalm119.stanzas[letter]
}

/** Stanza heading, e.g. אות א׳. */
export function letterLabel(letter: string): string {
  return `אות ${letter}\u05F3`
}

export function mishnahFor(letter: string): MishnahEntry | undefined {
  return mishnayotData.letters[letter]
}

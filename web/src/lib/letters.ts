/**
 * Typed accessor over data/letter-index.json + data/mishnayot-map.json:
 * name -> acrostic letters (sofit mapping, dedupe), psalm-119 stanzas and
 * per-letter mishnah references (from the itim harvest).
 */

import letterRaw from '../../data/letter-index.json'
import mishnayotRaw from '../../data/mishnayot-map.json'

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

/**
 * Letters of a Hebrew name: nikud stripped, final letters mapped to their
 * regular form (ן->נ, ף->פ, ...), duplicates removed keeping first order.
 */
export function resolveNameLetters(name: string): string[] {
  const seen = new Set<string>()
  const letters: string[] = []
  for (const ch of stripNikud(name)) {
    const regular = SOFIT_MAP[ch] ?? ch
    if (!isHebrewLetter(regular)) continue
    if (seen.has(regular)) continue
    seen.add(regular)
    letters.push(regular)
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

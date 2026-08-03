/**
 * Typed accessor over data/tehillim.json (normalized Tehillim, offline).
 * Returns canonical sheet text: ASCII quotes -> geresh/gershayim and
 * verse-ending colons -> sof pasuq (see lib/hebrew).
 */

import raw from '../../../data/tehillim.json'

import { hebrewNumeral, normalizePunctuation, sofPasuq, stripNikud } from '@/lib/hebrew'

export interface PsalmVerseData {
  id: number
  hebrewId: string
  hebrew: string
  transliteration: string
  english: string
  french: string
}

export interface PsalmChapterData {
  totalVerses: number
  verses: PsalmVerseData[]
}

export interface TehillimData {
  chapters: Record<string, PsalmChapterData>
}

export const tehillimData = raw as TehillimData

export function psalmChapter(chapter: number): PsalmChapterData | undefined {
  return tehillimData.chapters[String(chapter)]
}

export function psalmVerses(chapter: number): PsalmVerseData[] {
  return psalmChapter(chapter)?.verses ?? []
}

export function psalmVerse(chapter: number, id: number): PsalmVerseData | undefined {
  return psalmVerses(chapter).find((verse) => verse.id === id)
}

/** Verse texts in canonical form: punctuation normalized, nikud stripped on demand. */
export function psalmVerseTexts(chapter: number, opts?: { nikud?: boolean }): string[] {
  return psalmVerses(chapter).map((verse) => verseText(verse.hebrew, opts))
}

/** Verse texts for the given 1-based verse ids (used for psalm-119 stanzas). */
export function psalmVerseTextsByIds(chapter: number, ids: number[], opts?: { nikud?: boolean }): string[] {
  const byId = new Map(psalmVerses(chapter).map((verse) => [verse.id, verse]))
  return ids.map((id) => verseText(byId.get(id)?.hebrew ?? '', opts))
}

function verseText(hebrew: string, opts?: { nikud?: boolean }): string {
  let text = normalizePunctuation(sofPasuq(hebrew))
  if (!opts?.nikud) text = stripNikud(text)
  return text
}

/** Chapter heading, e.g. פרק ל״ג. */
export function psalmChapterLabel(chapter: number): string {
  return `פרק ${hebrewNumeral(chapter)}`
}

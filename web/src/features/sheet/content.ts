/**
 * P3-03 Sheet content model: the ordered, typed block list that makes up a
 * yahrzeit sheet, derived from SheetSettings + the committed offline data
 * (tehillim.json, liturgy.json, letter-index.json, mishnayot-map.json).
 *
 * Blocks are the "sections" of the sheet; pagination splits them into
 * PageItems (see pagination.ts): psalm bodies become per-verse items that
 * may flow across pages, prayer texts are cut at splitBlocks() granularity
 * and move whole, everything else moves as a unit.
 */

import { normalizePunctuation } from '@/lib/hebrew'
import {
  kaddishDerabananCombined,
  liturgyBlockHtml,
  nusachTexts,
  NESHAMA_LETTERS,
  splitBlocks,
} from '@/lib/liturgy'
import { mishnahFor, psalm119Stanza, resolveNameLetters } from '@/lib/letters'
import { psalmChapterLabel, psalmVerseTextsByIds, psalmVerseTexts } from '@/lib/tehillim'
import { FIXED_PSALMS } from '@/lib/liturgy'

import type { SheetSettings } from '@/features/sheet/layout'

export interface PsalmChapterBlock {
  chapter: number
  label: string
  verses: string[]
}

export interface StanzaBlock {
  letter: string
  label: string
  verses: string[]
}

export interface MishnahItemBlock {
  letter: string
  label: string
  source: string
  text: string
}

export type SheetBlock =
  | { kind: 'header'; text: string }
  | { kind: 'blessing'; title: string; html: string }
  | { kind: 'psalms'; chapters: PsalmChapterBlock[] }
  | { kind: 'letters'; title: string; stanzas: StanzaBlock[] }
  | { kind: 'mishnayot'; items: MishnahItemBlock[] }
  | { kind: 'prayer'; title: string; html: string }

export const HEADER_PREFIX = 'תפילות ולימוד לע״נ'

/** Header line, e.g. תפילות ולימוד לע״נ יונתן יוסף בן צבי מרדכי ז״ל. */
export function sheetHeaderLine(settings: SheetSettings): string {
  const genderWord = settings.gender === 'female' ? 'בת' : 'בן'
  const name = settings.name?.trim() ?? ''
  const parent = settings.parent?.trim() ?? ''
  const parts = [HEADER_PREFIX]
  if (name) parts.push(name)
  if (parent) {
    if (name) parts.push(genderWord, parent)
    else parts.push(parent)
  }
  parts.push('ז״ל')
  return normalizePunctuation(parts.join(' '))
}

/** Acrostic letters for the given acrostic mode (name / parent / both). */
function acrosticLettersFor(settings: SheetSettings): { title: string; letters: string[] }[] {
  if (settings.acrostic === 'none') return []
  const name = settings.name?.trim() ? resolveNameLetters(settings.name) : []
  const parent = settings.parent?.trim() ? resolveNameLetters(settings.parent) : []
  const groups: { title: string; letters: string[] }[] = []
  if (settings.acrostic === 'name' || settings.acrostic === 'both') {
    if (name.length > 0) groups.push({ title: 'אותיות השם', letters: name })
  }
  if (settings.acrostic === 'parent' || settings.acrostic === 'both') {
    if (parent.length > 0) groups.push({ title: 'אותיות האב', letters: parent })
  }
  return groups
}

function buildLettersBlock(title: string, letters: string[], nikud: boolean): SheetBlock {
  const stanzas: StanzaBlock[] = []
  for (const letter of letters) {
    const stanza = psalm119Stanza(letter)
    if (!stanza) continue
    stanzas.push({
      letter,
      label: `אות ${letter}׳`,
      verses: psalmVerseTextsByIds(stanza.chapter, stanza.verseIds, { nikud }),
    })
  }
  return { kind: 'letters', title, stanzas }
}

function buildPrayerBlock(title: string, html: string): SheetBlock {
  return { kind: 'prayer', title, html }
}

/**
 * PageItem: the pagination granularity of a sheet. Psalm bodies are split
 * into per-verse items (they may flow across pages); prayer texts are cut at
 * splitBlocks() boundaries and move whole; headings keep with the next item.
 */

export type PageItem =
  | { id: string; kind: 'header'; text: string }
  | { id: string; kind: 'section-title'; text: string; keepWithNext?: boolean }
  | { id: string; kind: 'block'; html: string }
  | { id: string; kind: 'psalm-title'; label: string; keepWithNext?: boolean }
  | { id: string; kind: 'psalm-verse'; text: string }
  | { id: string; kind: 'stanza-title'; label: string; keepWithNext?: boolean }
  | { id: string; kind: 'stanza-verse'; text: string }
  | { id: string; kind: 'mishnah-title'; label: string; source: string; keepWithNext?: boolean }
  | { id: string; kind: 'mishnah-text'; text: string }

let itemSeq = 0
const nextItemId = (): string => {
  itemSeq += 1
  return `item-${itemSeq}`
}

export function sectionTitle(text: string, keepWithNext = true): PageItem {
  return { id: nextItemId(), kind: 'section-title', text, keepWithNext }
}

/** Flatten SheetBlocks into pagination items (psalms/letters per verse). */
export function buildPageItems(content: SheetBlock[]): PageItem[] {
  const items: PageItem[] = []

  for (const block of content) {
    switch (block.kind) {
      case 'header':
        items.push({ id: nextItemId(), kind: 'header', text: block.text })
        break
      case 'blessing':
        items.push(sectionTitle(block.title))
        for (const html of splitBlocks(block.html)) {
          items.push({ id: nextItemId(), kind: 'block', html })
        }
        break
      case 'psalms': {
        items.push(sectionTitle('תהילים'))
        for (const chapter of block.chapters) {
          items.push({ id: nextItemId(), kind: 'psalm-title', label: chapter.label, keepWithNext: true })
          for (const verse of chapter.verses) {
            items.push({ id: nextItemId(), kind: 'psalm-verse', text: verse })
          }
        }
        break
      }
      case 'letters': {
        items.push(sectionTitle(block.title))
        for (const stanza of block.stanzas) {
          items.push({ id: nextItemId(), kind: 'stanza-title', label: stanza.label, keepWithNext: true })
          for (const verse of stanza.verses) {
            items.push({ id: nextItemId(), kind: 'stanza-verse', text: verse })
          }
        }
        break
      }
      case 'mishnayot': {
        items.push(sectionTitle('משניות'))
        for (const entry of block.items) {
          items.push({
            id: nextItemId(),
            kind: 'mishnah-title',
            label: entry.label,
            source: entry.source,
            keepWithNext: true,
          })
          items.push({ id: nextItemId(), kind: 'mishnah-text', text: entry.text })
        }
        break
      }
      case 'prayer':
        items.push(sectionTitle(block.title))
        for (const html of splitBlocks(block.html)) {
          items.push({ id: nextItemId(), kind: 'block', html })
        }
        break
    }
  }

  return items
}

/**
 * Build the sheet content for the given settings: every section toggle,
 * the blessing option, the acrostic mode and the nikud setting are applied
 * here, so content and rendering share one source of truth.
 */
export function buildSheetContent(settings: SheetSettings): SheetBlock[] {
  const blocks: SheetBlock[] = []
  const nikud = settings.nikud === 1
  const texts = nusachTexts(settings.nusach)

  blocks.push({ kind: 'header', text: sheetHeaderLine(settings) })

  if (settings.blessing === 1) {
    const blessing = texts.prayersBefore[0]
    if (blessing) {
      blocks.push({
        kind: 'blessing',
        title: blessing.title,
        html: liturgyBlockHtml(blessing.content, { nikud }),
      })
    }
  }

  if (settings.sections.includes('psalms')) {
    blocks.push({
      kind: 'psalms',
      chapters: FIXED_PSALMS.map((chapter) => ({
        chapter,
        label: psalmChapterLabel(chapter),
        verses: psalmVerseTexts(chapter, { nikud }),
      })),
    })
    for (const group of acrosticLettersFor(settings)) {
      blocks.push(buildLettersBlock(group.title, group.letters, nikud))
    }
  }

  if (settings.sections.includes('neshama') && settings.acrostic !== 'none') {
    blocks.push(buildLettersBlock('אותיות נשמה', [...NESHAMA_LETTERS], nikud))
  }

  if (settings.sections.includes('kaddish')) {
    blocks.push(buildPrayerBlock('קדיש יתום', liturgyBlockHtml(texts.kaddishYatom, { nikud })))
    blocks.push(
      buildPrayerBlock('קדיש דרבנן', liturgyBlockHtml(kaddishDerabananCombined(settings.nusach), { nikud })),
    )
  }

  if (settings.sections.includes('mishnayot')) {
    const letters = resolveNameLetters(settings.name ?? '').length > 0
      ? resolveNameLetters(settings.name ?? '')
      : [...NESHAMA_LETTERS]
    const items: MishnahItemBlock[] = []
    for (const letter of letters) {
      const mishnah = mishnahFor(letter)
      if (!mishnah) continue
      items.push({
        letter,
        label: `אות ${letter}׳`,
        source: mishnah.source,
        text: liturgyBlockHtml(mishnah.text, { nikud }),
      })
    }
    if (items.length > 0) blocks.push({ kind: 'mishnayot', items })
  }

  if (settings.sections.includes('hashkava')) {
    blocks.push(buildPrayerBlock('השכבה', liturgyBlockHtml(texts.hashkava, { nikud })))
  }

  if (settings.sections.includes('closing')) {
    blocks.push(
      buildPrayerBlock('תפילות ביציאה מבית העלמין', liturgyBlockHtml(texts.closingPrayers, { nikud })),
    )
  }

  return blocks
}

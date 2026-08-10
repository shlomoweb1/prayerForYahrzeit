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

import { HDate, Locale, gematriya } from '@hebcal/core'

import { normalizePunctuation } from '@/lib/hebrew'
import {
  elMaleRachamimText,
  hashkavaTraditionalText,
  liturgyBlockHtml,
  nusachTexts,
  NESHAMA_LETTERS,
  splitBlocks,
} from '@/lib/liturgy'
import { mishnahFor, psalm119Stanza, resolveNameLetters, type NameLetter } from '@/lib/letters'
import { psalmChapterLabel, psalmVerseTextsByIds, psalmVerseTexts } from '@/lib/tehillim'
import { FIXED_PSALMS } from '@/lib/liturgy'

import type { KaddishSpeaker } from '@/lib/liturgy'
import type { SheetSettings, SheetNusach, KaddishResponseLabel } from '@/features/sheet/layout'

export interface PsalmChapterBlock {
  chapter: number
  label: string
  verses: string[]
}

export interface StanzaBlock {
  letter: string
  label: string
  verses: string[]
  /** Global verse numbers within Psalm 119 (e.g. א׳ is verses 1-8, ב׳ is
   * 9-16, ...) - a stanza never starts counting over at 1, so this is the
   * true pasuk numbering, not the stanza's own local verse index. */
  verseIds: number[]
}

export interface MishnahItemBlock {
  letter: string
  label: string
  source: {
    chapter: string;
    tractate: string;
  }
  text: string
}

/**
 * Which prayer a rendered text block belongs to. Rows in the per-element
 * font panel and the matching `--izkor-font-*` CSS vars are keyed on this.
 * `closing` (the whole "תפילות ביציאה" section) is resolved into per-passage
 * ids (`closing-0/1/2`) in buildPageItems, since splitBlocks() cuts it into
 * three separate chunks: the dry-bones vision, אב הרחמים and בקשת פרידה.
 */
export type SheetPrayerId = 'blessing' | 'kaddish' | 'elMaleh' | 'hashkava' | 'closing'
export type SheetPrayerChunk = SheetPrayerId | 'closing-0' | 'closing-1' | 'closing-2'

export type SheetBlock =
  | { kind: 'header'; text: string; deathDateText?: string }
  | { kind: 'blessing'; title: string; html: string; prayer: 'blessing' }
  | { kind: 'kaddish'; title: string; sections: KaddishSectionChunk[]; nusach: SheetNusach; responseLabel: KaddishResponseLabel }
  | { kind: 'psalms'; chapters: PsalmChapterBlock[] }
  | { kind: 'letters'; title: string; stanzas: StanzaBlock[] }
  | { kind: 'mishnayot'; items: MishnahItemBlock[] }
  | { kind: 'prayer'; title: string; html: string; prayer: SheetPrayerId }

/**
 * One rendered kaddish line inside a section: the speaker role (which drives
 * the layout's per-speaker styling and the printed label) plus the processed
 * html. Sections are the exchange granularity - a mourner line followed by
 * the response lines it ends in (אמן etc.), or a standalone rubric note -
 * and each renders as its own flex container, so a section is never split
 * across pages or lines.
 */
export interface KaddishSectionLine {
  speaker: KaddishSpeaker
  html: string
}

/**
 * Which visual treatment a kaddish exchange gets, computed once here instead
 * of guessed from position in CSS (:nth-child) - the ashkenaz and sepharadi
 * rites have a different number of exchanges before the יהא שמיה רבא line
 * (sepharad splits בעלמא... into two, ashkenaz keeps it in one), so a fixed
 * nth-child index in CSS would point at the wrong chunk depending on nusach.
 * `lead` is the opening יתגדל exchange (tiny congregation cue), `wide` is
 * every exchange between it and the joint line (width-constrained so the
 * long בעלמא text wraps like the printed original), `joint` / `note` mirror
 * the line-level speaker roles, and `plain` is everything after the joint
 * line.
 */
export type KaddishChunkRole = 'lead' | 'wide' | 'joint' | 'note' | 'plain'

export interface KaddishSectionChunk {
  role: KaddishChunkRole
  lines: KaddishSectionLine[]
}

export const HEADER_PREFIX = 'לע״נ'

/** "בן" for male, "בת" for female - the word linking a name to its parent's. */
export function filialWord(gender: SheetSettings['gender']): 'בן' | 'בת' {
  return gender === 'female' ? 'בת' : 'בן'
}

/** "הכהן" / "הלוי" appended before ז״ל for Kohen/Levi lineage, else nothing. */
export function lineageWord(lineage: SheetSettings['lineage']): string | null {
  if (lineage === 'kohen') return 'הכהן'
  if (lineage === 'levi') return 'הלוי'
  return null
}

/** Header line, e.g. תפילות ולימוד לע״נ יונתן יוסף בן צבי מרדכי הלוי ז״ל. */
export function sheetHeaderLine(settings: SheetSettings): string {
  const genderWord = filialWord(settings.gender)
  const name = settings.name?.trim() ?? ''
  const parent = settings.parent?.trim() ?? ''
  const parts = [HEADER_PREFIX]
  if (name) parts.push(name)
  if (parent) {
    if (name) parts.push(genderWord, parent)
    else parts.push(parent)
  }
  const lineage = lineageWord(settings.lineage)
  if (lineage) parts.push(lineage)
  parts.push('ז״ל')
  return normalizePunctuation(parts.join(' '))
}

/**
 * "נפטר/ה <יום> <חודש> ה<שנה>" (e.g. נפטר י׳ אב התשפ״ו) from the Hebrew
 * calendar date stored on step 4 (`SheetSettings.deathDate`, an R.D. day
 * count - see `WizardQuery.deathDate`). `undefined` when the step was
 * skipped, so callers can omit the phrase entirely rather than print a
 * placeholder.
 */
export function sheetDeathDateLine(settings: SheetSettings): string | undefined {
  if (!settings.deathDate) return undefined
  const hdate = new HDate(settings.deathDate)
  const day = gematriya(hdate.getDate())
  const month = Locale.gettext(hdate.getMonthName(), 'he-x-NoNikud')
  const year = gematriya(hdate.getFullYear())
  const verb = settings.gender === 'female' ? 'נפטרה' : 'נפטר'
  return normalizePunctuation(`${verb} ${day} ${month} ה${year}`)
}

/** Name phrase for the middle of a prayer (e.g. אל מלא רחמים, השכבה), e.g.
 * "יונתן יוסף בן צבי מרדכי הלוי" - no לע״נ prefix or ז״ל suffix. */
export function deceasedNamePhrase(settings: SheetSettings): string {
  const genderWord = filialWord(settings.gender)
  const name = settings.name?.trim() ?? ''
  const parent = settings.parent?.trim() ?? ''
  const parts: string[] = []
  if (name) parts.push(name)
  if (parent) {
    if (name) parts.push(genderWord, parent)
    else parts.push(parent)
  }
  const lineage = lineageWord(settings.lineage)
  if (lineage) parts.push(lineage)
  return normalizePunctuation(parts.join(' '))
}

/** Letters that are already in regular form (e.g. נשמה) - display === lookup. */
function identityLetters(letters: readonly string[]): NameLetter[] {
  return letters.map((letter) => ({ display: letter, lookup: letter }))
}

/** Acrostic letters for the given acrostic mode (name / parent / both). */
function acrosticLettersFor(settings: SheetSettings): { title: string; letters: NameLetter[] }[] {
  if (settings.acrostic === 'none') return []
  const name = settings.name?.trim() ? resolveNameLetters(settings.name) : []
  const parent = settings.parent?.trim() ? resolveNameLetters(settings.parent) : []
  const groups: { title: string; letters: NameLetter[] }[] = []
  if (settings.acrostic === 'name' || settings.acrostic === 'both') {
    if (name.length > 0) groups.push({ title: 'אותיות השם', letters: name })
  }
  if (settings.acrostic === 'parent' || settings.acrostic === 'both') {
    if (parent.length > 0) groups.push({ title: 'אותיות האב', letters: parent })
  }
  return groups
}

/** letters: display/lookup pairs - display (final forms kept) drives the
 * label, lookup (regular form) finds the psalm-119 stanza. */
function buildLettersBlock(title: string, letters: NameLetter[], nikud: boolean): SheetBlock {
  const stanzas: StanzaBlock[] = []
  for (const { display, lookup } of letters) {
    const stanza = psalm119Stanza(lookup)
    if (!stanza) continue
    stanzas.push({
      letter: display,
      label: `אות ${display}׳`,
      verses: psalmVerseTextsByIds(stanza.chapter, stanza.verseIds, { nikud }),
      verseIds: stanza.verseIds,
    })
  }
  return { kind: 'letters', title, stanzas }
}

function buildPrayerBlock(title: string, html: string, prayer: SheetPrayerId): SheetBlock {
  return { kind: 'prayer', title, html, prayer }
}

/**
 * PageItem: the pagination granularity of a sheet. Psalm bodies are split
 * into per-verse items (they may flow across pages); prayer texts are cut at
 * splitBlocks() boundaries and move whole; headings keep with the next item.
 */

export type PageItem =
  | { id: string; kind: 'header'; text: string }
  | { id: string; kind: 'section-title'; text: string; keepWithNext?: boolean }
  | { id: string; kind: 'block'; title?: string; html: string; prayer?: SheetPrayerChunk }
  | { id: string; kind: 'kaddish'; title: string; sections: KaddishSectionChunk[]; nusach: SheetNusach; responseLabel: KaddishResponseLabel }
  | { id: string; kind: 'psalm-title'; label: string; keepWithNext?: boolean }
  | { id: string; kind: 'psalm-verse'; text: string }
  | { id: string; kind: 'stanza-title'; label: string; keepWithNext?: boolean }
  | { id: string; kind: 'stanza-verse'; text: string }
  | { id: string; kind: 'mishnah-title'; label: string; source: MishnahItemBlock["source"]; keepWithNext?: boolean }
  | { id: string; kind: 'mishnah-text'; text: string }

let itemSeq = 0
const nextItemId = (): string => {
  itemSeq += 1
  return `item-${itemSeq}`
}

export function sectionTitle(text: string, keepWithNext = true): PageItem {
  return { id: nextItemId(), kind: 'section-title', text, keepWithNext }
}

/**
 * The closing section's three passages, in order, as emitted by splitBlocks()
 * on the closing-prayers text. Chunk ids map straight onto the per-passage
 * font panel rows (closingDryBones / closingAvHaRachamim / closingParting).
 */
const CLOSING_CHUNK_PRAYERS = ['closing-0', 'closing-1', 'closing-2'] as const

function closingChunkPrayer(index: number): SheetPrayerChunk {
  return CLOSING_CHUNK_PRAYERS[Math.min(index, CLOSING_CHUNK_PRAYERS.length - 1)]!
}

/**
 * Split a mishnah's text at its inline paragraph markers - the harvested data
 * marks each mishnah paragraph with a Hebrew letter + period ("ב. ", "ג. ",
 * ...) instead of <br> tags, and the sheet renders them as one flowing block.
 * Splitting here turns each paragraph into a `data-type="psalm"` span, which
 * is exactly what splitOversizedItem needs to cut an oversized mishnah at a
 * paragraph boundary (same as it cuts psalm chapters at verse boundaries).
 */
export function splitMishnahParagraphs(text: string): string[] {
  return text
    .split(/\s(?=[א-ת]\.\s)/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0)
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
        splitBlocks(block.html).forEach((html, index) => {
          items.push({ id: nextItemId(), kind: 'block', title: index === 0 ? block.title : undefined, html, prayer: 'blessing' })
        })
        break
      case 'kaddish':
        // The whole קדיש יתום block is one page item: title + every exchange
        // in a single container (it fits a page, and it keeps the section a
        // self-contained unit to restyle - see [data-content="kaddish"]).
        items.push({ id: nextItemId(), kind: 'kaddish', title: block.title, sections: block.sections, nusach: block.nusach, responseLabel: block.responseLabel })
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
          });
          items.push({ id: nextItemId(), kind: 'mishnah-text', text: entry.text })
        }
        break
      }
      case 'prayer': {
        splitBlocks(block.html).forEach((html, index) => {
          items.push({
            id: nextItemId(),
            kind: 'block',
            title: index === 0 ? block.title : undefined,
            html,
            prayer: block.prayer === 'closing' ? closingChunkPrayer(index) : block.prayer,
          })
        })
        break
      }
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

  blocks.push({
    kind: 'header',
    text: sheetHeaderLine(settings),
    deathDateText: sheetDeathDateLine(settings),
  })

  if (settings.blessing === 1) {
    const blessing = texts.prayersBefore[0]
    if (blessing) {
      blocks.push({
        kind: 'blessing',
        title: blessing.title,
        html: liturgyBlockHtml(blessing.content, { nikud }),
        prayer: 'blessing',
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
    blocks.push(buildLettersBlock('אותיות נשמה', identityLetters(NESHAMA_LETTERS), nikud))
  }

  // Only קדיש יתום - the one recited at the graveside itself. קדיש דרבנן
  // (after learning mishnayot) belongs to the shiva/mourning-house visit,
  // not this sheet; a future "shiva" sheet edition can add it back.
  if (settings.sections.includes('kaddish')) {
    const sections: KaddishSectionLine[][] = []
    let current: KaddishSectionLine[] = []
    for (const line of texts.kaddishYatom) {
      // Every section opens with the mourners' line; the congregation's
      // response (הקהל) that ends in it belongs to the same section. The
      // joint line (הקהל והאבלים: יהא שמה רבא) and the rubric notes open
      // sections of their own - the layout CSS styles the joint line as its
      // own row ([data-content="kaddish-section-chunk"]:nth-child(3)).
      if (line.speaker !== 'congregation' && current.length > 0) {
        sections.push(current)
        current = []
      }
      current.push({ speaker: line.speaker, html: liturgyBlockHtml(line.text, { nikud }) })
    }
    if (current.length > 0) sections.push(current)

    const jointIndex = sections.findIndex((section) => section.some((line) => line.speaker === 'joint'))
    const chunks: KaddishSectionChunk[] = sections.map((lines, index) => {
      const role: KaddishChunkRole = lines.some((line) => line.speaker === 'note')
        ? 'note'
        : lines.some((line) => line.speaker === 'joint')
          ? 'joint'
          : index === 0
            ? 'lead'
            : jointIndex >= 0 && index < jointIndex
              ? 'wide'
              : 'plain'
      return { role, lines }
    })
    blocks.push({
      kind: 'kaddish',
      title: 'קדיש יתום',
      sections: chunks,
      nusach: settings.nusach,
      responseLabel: settings.kaddishResponseLabel,
    })
  }

  if (settings.sections.includes('mishnayot')) {
    const nameLetters = resolveNameLetters(settings.name ?? '')
    const letters = nameLetters.length > 0 ? nameLetters : identityLetters(NESHAMA_LETTERS)
    const items: MishnahItemBlock[] = []
    for (const { display, lookup } of letters) {
      const mishnah = mishnahFor(lookup)
      if (!mishnah) continue;
      items.push({
        letter: display,
        label: `אות ${display}׳`,
        source: {
          chapter: mishnah.chapter,
          tractate: mishnah.tractate
        },
        text: liturgyBlockHtml(mishnah.text, { nikud }),
      })
    }
    if (items.length > 0) blocks.push({ kind: 'mishnayot', items })
  }

  if (settings.sections.includes('hashkava')) {
    const namePhrase = deceasedNamePhrase(settings)
    if (settings.hashkavaVariant === 'elMaleh' || settings.hashkavaVariant === 'both') {
      blocks.push(
        buildPrayerBlock(
          'אל מלא רחמים',
          liturgyBlockHtml(elMaleRachamimText(settings.gender, namePhrase, settings.elMalehPhrase), { nikud }),
          'elMaleh',
        ),
      )
    }
    if (settings.hashkavaVariant === 'traditional' || settings.hashkavaVariant === 'both') {
      blocks.push(
        buildPrayerBlock(
          'השכבה',
          liturgyBlockHtml(hashkavaTraditionalText(settings.nusach, settings.gender, namePhrase), { nikud }),
          'hashkava',
        ),
      )
    }
  }

  if (settings.sections.includes('closing')) {
    blocks.push(
      buildPrayerBlock('תפילות ביציאה מבית העלמין', liturgyBlockHtml(texts.closingPrayers, { nikud }), 'closing'),
    )
  }

  return blocks
}

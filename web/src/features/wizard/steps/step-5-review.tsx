import { useMemo, useRef } from 'react'
import type { ReactNode } from 'react'

import { buildPageItems, buildSheetContent } from '@/features/sheet/content'
import type { PageItem, SheetBlock } from '@/features/sheet/content'
import { useSheetDraft } from '@/features/sheet/from-query'
import { hebrewNumeral } from '@/lib/hebrew'
import type { SheetGender } from '@/features/sheet/layout'
import { ScaleA4Preview } from '@/features/sheet/ScaleA4Preview'
import { SHEET_FONT_CLASS } from '@/features/sheet/generated/sheet-font-ids'
import { useSheetPagePlan } from '@/features/sheet/useSheetPagePlan'
import type { StepProps } from '@/features/wizard/step-registry'
import { StepShell } from '@/features/wizard/steps/step-shell'

/** A verse tagged with its own (1-based) ordinal — carried through splitting
 * so a continuation chunk keeps counting from where the previous one left
 * off, instead of restarting at 1. */
interface NumberedVerse {
  text: string
  pasuk: number
}

/**
 * A whole psalm chapter (badge + every verse) renders and paginates as one
 * block — verses are plain inline spans inside it, not separate <p>s, so
 * they run together as continuous wrapping text instead of each forcing its
 * own line. That inline flow is also why the chapter can't be split
 * per-verse anymore: it moves to the next page as a unit, like a prayer
 * block already does.
 */
interface ChapterItem {
  id: string
  kind: 'psalm-chapter'
  keepWithNext?: boolean
  label: string
  chapter: number
  verses: NumberedVerse[]
}

/**
 * Same idea, for the name/parent acrostic letters (אותיות השם וכו'): each
 * letter's psalm-119 stanza folds into one flowing block, badged with its
 * own letter (e.g. "אות א׳") captioned by the group it belongs to (e.g.
 * "אותיות השם") instead of a separate section heading above the whole group.
 */
interface LetterStanzaItem {
  id: string
  kind: 'letter-stanza'
  keepWithNext?: boolean
  groupCaption: string
  label: string
  verses: NumberedVerse[]
}

/**
 * Heading shown before each letter group (אותיות השם / האב / נשמה) — the
 * name group gets the instructional sentence, the others their plain title.
 */
interface LettersHeadingItem {
  id: string
  kind: 'letters-heading'
  keepWithNext?: boolean
  text: string
}

type DisplayItem = PageItem | ChapterItem | LetterStanzaItem | LettersHeadingItem

function nameSectionHeading(gender: SheetGender): string {
  const deceasedWord = gender === 'female' ? 'המנוחה' : 'הנפטר'
  return `כאן אומרים ממזמור תהילים קי"ט פסוקים כשמו של ${deceasedWord}`
}

/** Psalm 119 is the only source for every letter stanza — its chapter number never varies. */
const PSALM_119_CHAPTER = 119

function buildDisplayItems(items: PageItem[], gender: SheetGender, content: SheetBlock[]): DisplayItem[] {
  const psalmsBlock = content.find((block): block is Extract<SheetBlock, { kind: 'psalms' }> => block.kind === 'psalms')
  const chapterNumbers = psalmsBlock?.chapters.map((c) => c.chapter) ?? []
  let chapterCursor = 0

  // Each letters group's stanzas carry the true Psalm 119 verse numbers
  // (verseIds) — a stanza never starts counting over at 1 (e.g. ב׳ is
  // verses 9-16), so buildPageItems' flattened stanza-verse items (plain
  // text only) aren't enough; go back to the source block for the numbers.
  const stanzasByGroupTitle = new Map(
    content
      .filter((block): block is Extract<SheetBlock, { kind: 'letters' }> => block.kind === 'letters')
      .map((block) => [block.title, block.stanzas]),
  )

  const result: DisplayItem[] = []
  let i = 0
  while (i < items.length) {
    const item = items[i]!

    if (item.kind === 'psalm-title') {
      const verses: NumberedVerse[] = []
      let j = i + 1
      while (j < items.length && items[j]!.kind === 'psalm-verse') {
        const text = (items[j] as Extract<PageItem, { kind: 'psalm-verse' }>).text
        verses.push({ text, pasuk: verses.length + 1 })
        j += 1
      }
      const chapter = chapterNumbers[chapterCursor] ?? 0
      chapterCursor += 1
      result.push({ id: item.id, kind: 'psalm-chapter', label: item.label, chapter, verses })
      i = j
      continue
    }

    if (item.kind === 'section-title' && items[i + 1]?.kind === 'stanza-title') {
      const groupCaption = item.text
      // Every letter group gets its own heading — without one, consecutive
      // groups (name / parent / נשמה) have nothing but a tiny per-badge
      // caption between them and read as one run-on block of letters.
      const headingText = groupCaption === 'אותיות השם' ? nameSectionHeading(gender) : groupCaption
      result.push({ id: `${item.id}-heading`, kind: 'letters-heading', keepWithNext: true, text: headingText })
      const stanzasForGroup = stanzasByGroupTitle.get(groupCaption) ?? []
      let stanzaCursor = 0
      let j = i + 1
      while (j < items.length && items[j]!.kind === 'stanza-title') {
        const titleItem = items[j] as Extract<PageItem, { kind: 'stanza-title' }>
        const verseIds = stanzasForGroup[stanzaCursor]?.verseIds ?? []
        stanzaCursor += 1
        const verses: NumberedVerse[] = []
        let k = j + 1
        while (k < items.length && items[k]!.kind === 'stanza-verse') {
          const text = (items[k] as Extract<PageItem, { kind: 'stanza-verse' }>).text
          const pasuk = verseIds[verses.length] ?? verses.length + 1
          verses.push({ text, pasuk })
          k += 1
        }
        result.push({ id: titleItem.id, kind: 'letter-stanza', groupCaption, label: titleItem.label, verses })
        j = k
      }
      i = j
      continue
    }

    result.push(item)
    i += 1
  }
  return result
}

/**
 * Fallback for a chapter/stanza that's still taller than a whole empty page
 * as one flowing block (e.g. Psalm 104's 35 verses) — pack alone can't fix
 * that, so cut it into smaller flowing chunks at a verse boundary. Reads
 * each verse span's real rendered position (it's already on-screen in the
 * measurement host) to find where content first exceeds maxHeight, so the
 * cut point accounts for the actual Hebrew text wrapping, not a guess. Only
 * the first chunk keeps the badge — later chunks are a continuation of the
 * same chapter/stanza, not a new one.
 */
// Cut chunks a bit under the real budget: a continuation chunk re-renders
// without the badge, which slightly changes how its first line wraps, so an
// exact-to-the-pixel cut can end up a few px over once re-measured standalone.
const SPLIT_SAFETY_MARGIN_PX = 16

function splitOversizedItem(item: DisplayItem, el: HTMLElement, maxHeight: number): DisplayItem[] | null {
  if (item.kind !== 'psalm-chapter' && item.kind !== 'letter-stanza') return null
  const verseEls = Array.from(el.querySelectorAll('[data-type="psalm"]')) as HTMLElement[]
  if (verseEls.length < 2) return null

  const budget = maxHeight - SPLIT_SAFETY_MARGIN_PX
  const blockTop = el.getBoundingClientRect().top
  const chunkVerseIndices: number[][] = []
  let current: number[] = []
  let chunkStartTop = 0
  verseEls.forEach((verseEl, idx) => {
    const rect = verseEl.getBoundingClientRect()
    const bottom = rect.bottom - blockTop
    if (current.length > 0 && bottom - chunkStartTop > budget) {
      chunkVerseIndices.push(current)
      current = []
      chunkStartTop = rect.top - blockTop
    }
    current.push(idx)
  })
  if (current.length > 0) chunkVerseIndices.push(current)
  if (chunkVerseIndices.length < 2) return null

  return chunkVerseIndices.map((idxs, chunkIndex) => {
    const chunkVerses = idxs.map((i) => item.verses[i]!)
    const id = `${item.id}-chunk${chunkIndex}`
    const label = chunkIndex === 0 ? item.label : ''
    if (item.kind === 'psalm-chapter') {
      return { id, kind: 'psalm-chapter', label, chapter: item.chapter, verses: chunkVerses } satisfies ChapterItem
    }
    return { id, kind: 'letter-stanza', groupCaption: item.groupCaption, label, verses: chunkVerses } satisfies LetterStanzaItem
  })
}

function renderPageItem(item: DisplayItem): ReactNode {
  switch (item.kind) {
    case 'header':
    case 'psalm-title':
    case 'psalm-verse':
      return null
    case 'section-title':
      // Every chapter badge already carries "תהילים" — the section heading
      // would just repeat it.
      if (item.text === 'תהילים') return null
      return <h2 data-content="section-title">{item.text}</h2>
    case 'block':
      return <div data-content="block" dangerouslySetInnerHTML={{ __html: item.html }} />
    case 'psalm-chapter':
      return (
        <p data-content="chapter-flow" data-perek={hebrewNumeral(item.chapter)} data-perek-gimatriya={item.chapter}>
          {item.label ? (
            <span data-content="chapter-badge">
              <span data-content="chapter-caption">תהילים</span>
              <span data-content="chapter-num">{item.label}</span>
            </span>
          ) : null}
          {item.verses.map((verse) => (
            <span data-type="psalm" data-pasuk={hebrewNumeral(verse.pasuk)} data-pasuk-gimatriya={verse.pasuk} key={verse.pasuk}>
              {verse.text}{' '}
            </span>
          ))}
        </p>
      )
    case 'letters-heading':
      return <h2 data-content="section-title">{item.text}</h2>
    case 'letter-stanza':
      return (
        <p data-content="chapter-flow" data-perek={hebrewNumeral(PSALM_119_CHAPTER)} data-perek-gimatriya={PSALM_119_CHAPTER}>
          {item.label ? (
            <span data-content="chapter-badge">
              <span data-content="chapter-caption">{item.groupCaption}</span>
              <span data-content="chapter-num">{item.label}</span>
            </span>
          ) : null}
          {item.verses.map((verse) => (
            <span data-type="psalm" data-pasuk={hebrewNumeral(verse.pasuk)} data-pasuk-gimatriya={verse.pasuk} key={verse.pasuk}>
              {verse.text}{' '}
            </span>
          ))}
        </p>
      )
    case 'stanza-title':
    case 'stanza-verse':
      return null
    case 'mishnah-title':
      return (
        <div data-content="mishnah-title">
          <h4>{item.label}</h4>
          <span data-content="source">{item.source}</span>
        </div>
      )
    case 'mishnah-text':
      return <p data-content="mishnah-text">{item.text}</p>
  }
}

export function Step5Review({ search }: StepProps) {
  const sheetData = useSheetDraft(search)
  const content = useMemo(() => buildSheetContent(sheetData.settings), [sheetData.settings])
  const items = useMemo(() => buildPageItems(content).filter((item) => item.kind !== 'header'), [content])
  const displayItems = useMemo(
    () => buildDisplayItems(items, sheetData.settings.gender, content),
    [items, sheetData.settings.gender, content],
  )
  const headerText = content.find((c) => c.kind === 'header')?.text ?? ''
  const fontClass = SHEET_FONT_CLASS[sheetData.settings.font]

  const emptyContentRef = useRef<HTMLDivElement>(null)
  const itemsHostRef = useRef<HTMLDivElement>(null)
  const { plan, measuredItems } = useSheetPagePlan(displayItems, emptyContentRef, itemsHostRef, splitOversizedItem)

  return (
    <StepShell stepNumber={5} titleKey="wizard.steps.5.title" descriptionKey="wizard.steps.5.description">
     <div className="flex flex-1 flex-row" data-step="5">
        <div className="w-87.5">a</div>
        <div className="grow bg-gray-200 overflow-y-auto p-6">
          <ScaleA4Preview>
            <div data-sheet-measure="true" aria-hidden="true">
              <div data-page={sheetData.layout.paper} className={fontClass}>
                <div data-section="header">
                  <div data-content="bsd">בס"ד</div>
                  <div data-content="title">
                    <h1>סדר עלייה לקבר</h1>
                    <h2>{headerText} - נפטר י' מנחם אב התשפ"ו</h2>
                  </div>
                </div>
                <div data-section="content" ref={emptyContentRef} />
                <div data-section="footer">
                  <div data-content="footer-text">{headerText}</div>
                  <div data-content="footer-paganation">עמוד 1 מתוך 1</div>
                </div>
              </div>
              <div data-page={sheetData.layout.paper} className={fontClass}>
                <div data-section="content" ref={itemsHostRef} style={{ position: 'relative' }}>
                  {measuredItems.map((item) => (
                    <div data-item-id={item.id} key={item.id}>
                      {renderPageItem(item)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {plan.map((pageItems, index) => (
              <div data-page={sheetData.layout.paper} className={fontClass} key={`page-${index}`}>
                <div data-section="header">
                  <div data-content="bsd">בס"ד</div>
                  <div data-content="title">
                    <h1>סדר עלייה לקבר</h1>
                    <h2>{headerText} - נפטר י' מנחם אב התשפ"ו</h2>
                  </div>
                </div>
                <div data-section="content">
                  {pageItems.map((item) => (
                    <div key={item.id}>{renderPageItem(item)}</div>
                  ))}
                </div>
                <div data-section="footer">
                  <div data-content="footer-text">{headerText}</div>
                  <div data-content="footer-paganation">
                    עמוד {index + 1} מתוך {plan.length}
                  </div>
                </div>
              </div>
            ))}
          </ScaleA4Preview>
        </div>
     </div>
    </StepShell>
  )
}

/**
 * SheetDocument: renders the sheet's pages for the on-screen editor preview
 * (step-5-review.tsx) — pre-paginated into fixed-size `[data-page]` boxes
 * via `useSheetPagePlan`'s browser-measurement packing, since a webpage has
 * no native concept of "pages" and has to fake the stacked-page look.
 *
 * The off-screen Folio capture (renderSheetHTML.tsx) does NOT reuse this
 * pre-paginated output — Folio is a real PDF layout engine with its own
 * pagination (`@page`, `page-break-*`, running headers via margin boxes) and
 * treats a fixed-height `overflow:hidden` div as ordinary content to lay
 * out, not a hard clip; feeding it browser-pre-chunked pages made it
 * re-paginate each one internally (a 3-page preview became a 24-page PDF).
 * Content-shaping (`buildDisplayItems`, `renderPageItem`, `deceasedWord`,
 * exported below) is still shared by both — only the pagination *strategy*
 * differs, because it fundamentally has to: one measures a browser viewport,
 * the other is real print layout. (A prior version of this file had its own
 * separate, even older per-verse-block rendering that never got the
 * chapter-flowing rewrite this content-shaping logic gave the live preview
 * — that's what originally produced a wildly different, much longer PDF
 * than the on-screen preview. This file replaced that; renderSheetHTML.tsx
 * replaced the fixed-page-chunking approach that replaced it in turn.)
 */

import { useMemo, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'

import { buildPageItems, splitMishnahParagraphs } from '@/features/sheet/content'
import type { MishnahItemBlock, PageItem, SheetBlock } from '@/features/sheet/content'
import { fontDef } from '@/features/sheet/fonts'
import { KaddishSection } from '@/features/sheet/kaddish-section'
import { SHEET_ELEMENT_FONTS, type SheetElementFonts, type SheetGender, type SheetLayout, type SheetSettings } from '@/features/sheet/layout'
import { useSheetPagePlan } from '@/features/sheet/useSheetPagePlan'
import { hebrewNumeral } from '@/lib/hebrew'

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

/**
 * A whole mishnah (black badge "משנה" + the מסכת/פרק source + the flowing
 * text) renders and paginates as one block, mirroring psalm chapters. The
 * text is pre-split into paragraphs (splitMishnahParagraphs — the data marks
 * paragraphs with "ב. " "ג. " inline letters, not <br>s) so an oversized
 * mishnah can be cut at a paragraph boundary by splitOversizedItem, exactly
 * like a psalm chapter is cut at verse boundaries.
 */
interface MishnahFlowItem {
  id: string
  kind: 'mishnah'
  label: string
  source: MishnahItemBlock["source"]
  paragraphs: NumberedVerse[]
}

export type DisplayItem = PageItem | ChapterItem | LetterStanzaItem | LettersHeadingItem | MishnahFlowItem

/**
 * Printed speaker labels for kaddish lines live in KaddishSection
 * (kaddish-section.tsx), the component that renders the kaddish sections.
 */

/** "המנוחה" for female, "הנפטר" for male — used mid-sentence (loading copy, section headings). */
export function deceasedWord(gender: SheetGender): string {
  return gender === 'female' ? 'המנוחה' : 'הנפטר'
}

function nameSectionHeading(gender: SheetGender): string {
  return `כאן אומרים ממזמור תהילים קי"ט פסוקים כשמו של ${deceasedWord(gender)}`
}

/** Psalm 119 is the only source for every letter stanza — its chapter number never varies. */
const PSALM_119_CHAPTER = 119

export function buildDisplayItems(items: PageItem[], gender: SheetGender, content: SheetBlock[]): DisplayItem[] {
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

    if (item.kind === 'mishnah-title') {
      const textItem = items[i + 1]
      const text = textItem && textItem.kind === 'mishnah-text' ? textItem.text : ''
      result.push({
        id: item.id,
        kind: 'mishnah',
        label: 'משנה',
        source: item.source,
        paragraphs: splitMishnahParagraphs(text).map((paragraph, index) => ({
          text: paragraph,
          pasuk: index + 1,
        })),
      })
      i += 2
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
  if (item.kind !== 'psalm-chapter' && item.kind !== 'letter-stanza' && item.kind !== 'mishnah') return null
  const verses = item.kind === 'mishnah' ? item.paragraphs : item.verses
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
    const chunkVerses = idxs.map((i) => verses[i]!)
    const id = `${item.id}-chunk${chunkIndex}`
    const label = chunkIndex === 0 ? item.label : ''
    if (item.kind === 'psalm-chapter') {
      return { id, kind: 'psalm-chapter', label, chapter: item.chapter, verses: chunkVerses } satisfies ChapterItem
    }
    if (item.kind === 'letter-stanza') {
      return { id, kind: 'letter-stanza', groupCaption: item.groupCaption, label, verses: chunkVerses } satisfies LetterStanzaItem
    }
    return { id, kind: 'mishnah', label, source: item.source, paragraphs: chunkVerses } satisfies MishnahFlowItem
  })
}

export function renderPageItem(item: DisplayItem): ReactNode {
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
      // data-prayer keys the per-prayer font override in the sheet CSS
      // (each prayer block renders in its own font unless overridden — see
      // SHEET_ELEMENT_FONTS' blessingText / elMalehText / closing* rows).
      // The section title lives inside the same wrapper as the content, so
      // every block is one self-contained div: title first, text after.
      return (
        <div data-content="block" data-prayer={item.prayer}>
          {item.title ? <h2 data-content="section-title">{item.title}</h2> : null}
          <div dangerouslySetInnerHTML={{ __html: item.html }} />
        </div>
      )
    case 'kaddish':
      // The whole קדיש יתום block as one container: the section title and
      // every exchange inside it. Each exchange is rendered by the dedicated
      // KaddishSection component (its own [data-content="kaddish-section"]
      // div), so the block reads title-first, content-after and every part
      // stays individually addressable in CSS.
      return (
        <div data-content="kaddish" data-nusach={item.nusach}>
          <h2 data-content="section-title">{item.title}</h2>
          <div data-content="kaddish-sections">
          {item.sections.map((chunk, index) => (
            <KaddishSection key={index} chunk={chunk} responseLabel={item.responseLabel} />
          ))}
          </div>
        </div>
      )
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
        <p
          data-content="chapter-flow"
          data-letters
          data-perek={hebrewNumeral(PSALM_119_CHAPTER)}
          data-perek-gimatriya={PSALM_119_CHAPTER}
        >
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
    case 'mishnah':
      // A whole mishnah flows as one justified block, badged like a psalm
      // chapter: the black "משנה" badge carries the מסכת/פרק source where
      // a chapter badge carries the psalm number. Continuation chunks (from
      // splitOversizedItem) drop the badge, same as chapter chunks.
      return (
        <p data-content="chapter-flow" data-type="mishnah-flow">
          {item.label ? (
            <span data-content="chapter-badge">
              <span data-content="chapter-caption">מסכת {item.source.tractate}</span>
              <span data-content="chapter-num">{item.source.chapter}</span>
            </span>
          ) : null}
          {item.paragraphs.map((paragraph) => (
            <span data-type="psalm" data-pasuk={hebrewNumeral(paragraph.pasuk)} data-pasuk-gimatriya={paragraph.pasuk} key={paragraph.pasuk}>
              {paragraph.text}{' '}
            </span>
          ))}
        </p>
      )
    case 'mishnah-title':
    case 'mishnah-text':
      // Consumed by buildDisplayItems (merged into a single 'mishnah' flow
      // item above) — never rendered on their own.
      return null
  }
}

/**
 * CSS custom properties consumed by preview.css's `div[data-page]` rules —
 * the one place SheetLayout/SheetElementFonts get translated into a page's
 * inline style. Width/height are also set directly (not left to the
 * `div[data-page="a4"]` CSS selector alone) so a paper size preview.css
 * doesn't have an explicit rule for still renders at the right size.
 *
 * Each of the 18 sheet elements (SHEET_ELEMENT_FONTS) gets its own
 * `--izkor-font-<element>` var; the sheet CSS maps the per-prayer blocks
 * onto them via data-prayer, the rest onto the element selectors directly.
 */
function elementFontVar(element: (typeof SHEET_ELEMENT_FONTS)[number]): string {
  return `--izkor-font-${element}`
}

export function sheetPageVars(layout: SheetLayout, fonts: SheetElementFonts): CSSProperties {
  const vars: Record<string, string> = {}
  for (const element of SHEET_ELEMENT_FONTS) {
    vars[elementFontVar(element)] = fontDef(fonts[element]).cssFamily
  }
  return {
    width: layout.page.widthPx,
    height: layout.page.heightPx,
    '--izkor-base-font-size': `${layout.baseFontPx}px`,
    '--izkor-line-height': `${layout.lineHeight}`,
    '--izkor-margin-x': `${layout.marginX}px`,
    '--izkor-margin-y': `${layout.marginY}px`,
    '--izkor-title-font-size': `${layout.titleFontPx}px`,
    '--izkor-heading-font-size': `${layout.headingFontPx}px`,
    // Base cascade fallback for chrome that isn't one of the 18
    // individually-controllable elements (the page footer, the joint/note
    // קדיש lines) — the global font, not a hardcoded family.
    '--izkor-font-default': fontDef(layout.fontId).cssFamily,
    ...vars,
  } as CSSProperties
}

export interface SheetDocumentProps {
  content: SheetBlock[]
  layout: SheetLayout
  settings: SheetSettings
}

/** בס"ד + title chrome repeated on every page. */
function PageHeader({ headerText, deathDateText }: { headerText: string; deathDateText?: string }) {
  return (
    <div data-section="header">
      <div data-content="bsd">בס"ד</div>
      <div data-content="title">
        <h1>סדר עלייה לקבר</h1>
        <h2>
          {headerText}
          {deathDateText ? ` - ${deathDateText}` : ''}
        </h2>
      </div>
    </div>
  )
}

/** Footer text + pagination ("עמוד X מתוך Y"), repeated on every page. */
function PageFooter({ headerText, index, total }: { headerText: string; index: number; total: number }) {
  return (
    <div data-section="footer">
      <div data-content="footer-text">{headerText}</div>
      <div data-content="footer-paganation">
        עמוד {index + 1} מתוך {total}
      </div>
    </div>
  )
}

export function SheetDocument({ content, layout, settings }: SheetDocumentProps) {
  const items = useMemo(() => buildPageItems(content).filter((item) => item.kind !== 'header'), [content])
  const displayItems = useMemo(
    () => buildDisplayItems(items, settings.gender, content),
    [items, settings.gender, content],
  )
  const headerBlock = content.find((c) => c.kind === 'header')
  const headerText = headerBlock?.text ?? ''
  const deathDateText = headerBlock?.deathDateText
  const pageVars = useMemo(() => sheetPageVars(layout, settings.fonts), [layout, settings.fonts])

  const emptyContentRef = useRef<HTMLDivElement>(null)
  const itemsHostRef = useRef<HTMLDivElement>(null)
  const { plan, measuredItems } = useSheetPagePlan(displayItems, emptyContentRef, itemsHostRef, splitOversizedItem)

  return (
    <>
      <div data-sheet-measure="true" aria-hidden="true">
        <div data-page={layout.paper} style={pageVars}>
          <PageHeader headerText={headerText} deathDateText={deathDateText} />
          <div data-section="content" ref={emptyContentRef} />
          <PageFooter headerText={headerText} index={0} total={1} />
        </div>
        <div data-page={layout.paper} style={pageVars}>
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
        <div data-page={layout.paper} style={pageVars} key={`page-${index}`}>
          <PageHeader headerText={headerText} deathDateText={deathDateText} />
          <div data-section="content">
            {pageItems.map((item) => (
              <div key={item.id}>{renderPageItem(item)}</div>
            ))}
          </div>
          <PageFooter headerText={headerText} index={index} total={plan.length} />
        </div>
      ))}
    </>
  )
}

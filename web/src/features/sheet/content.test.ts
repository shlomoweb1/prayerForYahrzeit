import { describe, expect, it } from 'vitest'

import { buildSheetContent, sheetHeaderLine, type SheetBlock } from '@/features/sheet/content'
import { NESHAMA_LETTERS } from '@/lib/liturgy'
import type { SheetSettings } from '@/features/sheet/layout'

const baseSettings = (overrides: Partial<SheetSettings> = {}): SheetSettings => ({
  paper: 'a4',
  gender: 'male',
  nusach: 'ashkenaz',
  name: 'יונתן יוסף',
  parent: 'צבי מרדכי',
  lineage: 'none',
  font: 'noto-serif',
  fontRoles: { title: 'noto-serif', heading: 'noto-serif', body: 'noto-serif' },
  lineDensity: 'normal',
  nikud: 1,
  deco: 1,
  acrostic: 'both',
  blessing: 0,
  hashkavaVariant: 'elMaleh',
  sections: ['psalms', 'neshama', 'kaddish', 'mishnayot', 'hashkava', 'closing'],
  ...overrides,
})

const kinds = (blocks: SheetBlock[]): string[] => blocks.map((block) => block.kind)

describe('sheetHeaderLine', () => {
  it('renders name with the father (בן) for a male', () => {
    expect(sheetHeaderLine(baseSettings())).toBe(
      'תפילות ולימוד לע״נ יונתן יוסף בן צבי מרדכי ז״ל',
    )
  })

  it('renders בת for a female', () => {
    const settings = baseSettings({ gender: 'female' })
    expect(sheetHeaderLine(settings)).toBe(
      'תפילות ולימוד לע״נ יונתן יוסף בת צבי מרדכי ז״ל',
    )
  })

  it('omits the father part when no parent name is given', () => {
    expect(sheetHeaderLine(baseSettings({ parent: undefined }))).toBe(
      'תפילות ולימוד לע״נ יונתן יוסף ז״ל',
    )
  })

  it('does not crash for a fully empty name and parent', () => {
    const line = sheetHeaderLine(baseSettings({ name: undefined, parent: undefined }))
    expect(line).toBe('תפילות ולימוד לע״נ ז״ל')
  })
})

describe('buildSheetContent', () => {
  it('builds the full sheet for default settings', () => {
    const content = buildSheetContent(baseSettings())
    expect(kinds(content)).toEqual([
      'header',
      'psalms',
      'letters', // אותיות השם
      'letters', // אותיות האב
      'letters', // אותיות נשמה
      'prayer', // קדיש יתום
      'mishnayot',
      'prayer', // אל מלא רחמים
      'prayer', // תפילות ביציאה
    ])
    const psalms = content.find((block) => block.kind === 'psalms')
    expect(psalms).toBeDefined()
    if (psalms?.kind === 'psalms') {
      expect(psalms.chapters.map((chapter) => chapter.chapter)).toEqual([33, 16, 17, 72, 91, 104, 130])
    }
  })

  it('resolves name letters with sofit mapping (משה → מ ש ה)', () => {
    const content = buildSheetContent(baseSettings({ name: 'משה' }))
    const lettersBlocks = content.filter((block) => block.kind === 'letters')
    expect(lettersBlocks).toHaveLength(3)
    const nameLetters = lettersBlocks.find((block) => block.title === 'אותיות השם')
    if (nameLetters?.kind === 'letters') {
      expect(nameLetters.stanzas.map((stanza) => stanza.letter)).toEqual(['מ', 'ש', 'ה'])
    }
  })

  it('uses parent letters for the acrostic in parent mode', () => {
    const content = buildSheetContent(baseSettings({ acrostic: 'parent' }))
    const lettersBlocks = content.filter((block) => block.kind === 'letters')
    expect(lettersBlocks).toHaveLength(2)
    expect(lettersBlocks[0]?.kind === 'letters' && lettersBlocks[0].title).toBe('אותיות האב')
  })

  it('drops every acrostic section in none mode', () => {
    const content = buildSheetContent(baseSettings({ acrostic: 'none' }))
    expect(content.some((block) => block.kind === 'letters')).toBe(false)
  })

  it('includes the blessing block only when the blessing setting is on', () => {
    const off = buildSheetContent(baseSettings({ blessing: 0 }))
    expect(off.some((block) => block.kind === 'blessing')).toBe(false)
    const on = buildSheetContent(baseSettings({ blessing: 1 }))
    expect(on.some((block) => block.kind === 'blessing')).toBe(true)
  })

  it('respects the section toggles', () => {
    const content = buildSheetContent(baseSettings({ sections: ['kaddish', 'hashkava'] }))
    expect(kinds(content)).toEqual(['header', 'prayer', 'prayer'])
  })

  it('kaddish yatom flows as prose: mourners lines unlabeled, congregation lines as a small parenthesized aside, the joint line alone', () => {
    const content = buildSheetContent(baseSettings({ sections: ['kaddish'], nikud: 0 }))
    const kaddish = content.find(
      (block): block is Extract<SheetBlock, { kind: 'prayer' }> => block.kind === 'prayer' && block.title === 'קדיש יתום',
    )
    expect(kaddish).toBeDefined()
    const html = kaddish!.html
    // The mourners' label never appears on its own — it would otherwise
    // repeat before nearly every line. The only occurrence left is the one
    // inside the joint line's own label ("הקהל והאבלים:").
    expect((html.match(/האבלים:/g) ?? []).length).toBe(1)
    // Congregation responses become a small parenthesized inline aside.
    expect(html).toContain('<span class=izkor-rubric>(הקהל: אמן.)</span>')
    // The harvest's bare "קהל:" (missing ה) is normalized before rendering.
    expect(html).toContain('<span class=izkor-rubric>(הקהל: בריך הוא.)</span>')
    expect(html).not.toContain('(קהל:')
    // Only one <br><br> pair in the whole text — around the isolated line.
    expect(html.match(/<br\s*\/?>\s*<br\s*\/?>/gi)?.length).toBe(2)
    // The isolated joint line is present, wrapped for its own paragraph.
    expect(html).toContain('<br><br><b>הקהל והאבלים: יהא שמה רבא מברך לעלם ולעלמי עלמיא.</b><br><br>')
  })

  it('strips nikud when the nikud setting is off', () => {
    const withNikud = buildSheetContent(baseSettings({ nikud: 1 }))
    const without = buildSheetContent(baseSettings({ nikud: 0 }))
    const chapterWith = withNikud.find((block) => block.kind === 'psalms')
    const chapterWithout = without.find((block) => block.kind === 'psalms')
    if (chapterWith?.kind === 'psalms' && chapterWithout?.kind === 'psalms') {
      const firstWith = chapterWith.chapters[0]!.verses[0]!
      const firstWithout = chapterWithout.chapters[0]!.verses[0]!
      expect(firstWith).toMatch(/[\u0591-\u05C7]/)
      expect(firstWithout).not.toMatch(/[\u0591-\u05C7]/)
    }
  })

  it('builds mishnayot from the deceased name letters, falling back to נשמה letters', () => {
    const named = buildSheetContent(baseSettings({ name: 'יוסף' }))
    const mishnayot = named.find((block) => block.kind === 'mishnayot')
    if (mishnayot?.kind === 'mishnayot') {
      expect(mishnayot.items.map((entry) => entry.letter)).toEqual(['י', 'ו', 'ס', 'פ'])
    }
    const anonymous = buildSheetContent(baseSettings({ name: undefined }))
    const fallback = anonymous.find((block) => block.kind === 'mishnayot')
    if (fallback?.kind === 'mishnayot') {
      expect(fallback.items.map((entry) => entry.letter)).toEqual([...NESHAMA_LETTERS])
    }
  })

  it('keeps psalm-119 stanza verses aligned with the letter index', () => {
    const content = buildSheetContent(baseSettings({ name: 'דוד' }))
    const lettersBlock = content.find((block) => block.kind === 'letters' && block.title === 'אותיות השם')
    if (lettersBlock?.kind === 'letters') {
      const dalet = lettersBlock.stanzas.find((stanza) => stanza.letter === 'ד')
      expect(dalet?.verses).toHaveLength(8)
      expect(dalet?.label).toBe('אות ד׳')
    }
  })
})

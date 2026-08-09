import { describe, expect, it } from 'vitest'

import { buildSheetContent, sheetHeaderLine, type SheetBlock } from '@/features/sheet/content'
import { NESHAMA_LETTERS } from '@/lib/liturgy'
import { defaultElementFonts, type SheetSettings } from '@/features/sheet/layout'

const baseSettings = (overrides: Partial<SheetSettings> = {}): SheetSettings => ({
  paper: 'a4',
  gender: 'male',
  nusach: 'ashkenaz',
  name: 'יונתן יוסף',
  parent: 'צבי מרדכי',
  lineage: 'none',
  font: 'noto-serif',
  fonts: defaultElementFonts('noto-serif'),
  lineDensity: 'normal',
  nikud: 1,
  deco: 1,
  acrostic: 'both',
  blessing: 0,
  hashkavaVariant: 'elMaleh',
  kaddishResponseLabel: 'congregation',
  elMalehPhrase: 'charity',
  sections: ['psalms', 'neshama', 'kaddish', 'mishnayot', 'hashkava', 'closing'],
  ...overrides,
})

const kinds = (blocks: SheetBlock[]): string[] => blocks.map((block) => block.kind)

describe('sheetHeaderLine', () => {
  it('renders name with the father (בן) for a male', () => {
    expect(sheetHeaderLine(baseSettings())).toBe(
      'לע״נ יונתן יוסף בן צבי מרדכי ז״ל',
    )
  })

  it('renders בת for a female', () => {
    const settings = baseSettings({ gender: 'female' })
    expect(sheetHeaderLine(settings)).toBe(
      'לע״נ יונתן יוסף בת צבי מרדכי ז״ל',
    )
  })

  it('omits the father part when no parent name is given', () => {
    expect(sheetHeaderLine(baseSettings({ parent: undefined }))).toBe(
      'לע״נ יונתן יוסף ז״ל',
    )
  })

  it('does not crash for a fully empty name and parent', () => {
    const line = sheetHeaderLine(baseSettings({ name: undefined, parent: undefined }))
    expect(line).toBe('לע״נ ז״ל')
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
      'kaddish', // קדיש יתום
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
    expect(kinds(content)).toEqual(['header', 'kaddish', 'prayer'])
  })

  it('kaddish yatom builds structured speaker-labeled sections (mourner line + its responses)', () => {
    const content = buildSheetContent(baseSettings({ sections: ['kaddish'], nikud: 0 }))
    const kaddish = content.find(
      (block): block is Extract<SheetBlock, { kind: 'kaddish' }> => block.kind === 'kaddish',
    )
    expect(kaddish).toBeDefined()
    const chunks = kaddish!.sections
    // 8 sections: 7 exchanges — every exchange opens with the mourners' line
    // and ends in a response line (the אמן etc. it was leading to) — plus the
    // joint line (יהא שמה רבא) as a section of its own, and one standalone
    // rubric note (the three-steps-back reminder) right before the final
    // exchange.
    expect(chunks).toHaveLength(8)
    for (const { lines } of chunks) {
      if (lines[0]?.speaker !== 'mourner') continue
      expect(lines[0]?.speaker).toBe('mourner')
      expect(lines[lines.length - 1]!.speaker).not.toBe('mourner')
    }
    // The opening יתגדל exchange is the "lead" chunk; every exchange up to
    // the joint line is "wide"; the joint line and the rubric note carry
    // their own roles; everything after the joint line is "plain".
    expect(chunks[0]!.role).toBe('lead')
    expect(chunks[1]!.role).toBe('wide')
    // The joint line (יהא שמה רבא) opens a section of its own — it is not
    // bundled with the mourner exchange that preceded it, so the layout can
    // put it on its own row.
    const jointChunk = chunks.find((chunk) => chunk.lines[0]?.speaker === 'joint')
    expect(jointChunk?.role).toBe('joint')
    expect(jointChunk?.lines).toHaveLength(1)
    expect(jointChunk?.lines).toMatchObject([{ speaker: 'joint' }])
    // The rubric note sits directly before the last exchange (עושה שלום).
    const noteIndex = chunks.findIndex((chunk) => chunk.lines[0]?.speaker === 'note')
    expect(noteIndex).toBe(chunks.length - 2)
    expect(chunks[noteIndex]!.role).toBe('note')
    expect(chunks[noteIndex]!.lines).toEqual([
      { speaker: 'note', html: '(האומרים קדיש פוסעים שלוש פסיעות לאחור)' },
    ])
    // Chunks after the joint line default to the "plain" role.
    const jointIndex = chunks.findIndex((chunk) => chunk.role === 'joint')
    for (const chunk of chunks.slice(jointIndex + 1)) {
      if (chunk.role === 'note') continue
      expect(chunk.role).toBe('plain')
    }
    const allLines = chunks.flatMap((chunk) => chunk.lines)
    // The harvest's bare "קהל:" (missing ה) is classified as congregation —
    // the response "בריך הוא." (the mourner line before it also contains
    // "בריך הוא" mid-text, so match the exact response).
    const bareCue = allLines.find((line) => line.html === 'בריך הוא.')
    expect(bareCue).toMatchObject({ speaker: 'congregation' })
    // Lines carry the role and the text only — no speaker cues survive into
    // the rendered html (labels are re-added at render time).
    for (const line of allLines) {
      expect(line.html).not.toMatch(/[\u0591-\u05C7]/)
      expect(line.html).not.toContain(':')
    }
  })

  it('נוסח ספרד (ashkenazSefard) swaps in the פורקנא/משיחא phrase on the בעלמא line only', () => {
    const kaddishOf = (nusach: SheetSettings['nusach']) => {
      const content = buildSheetContent(baseSettings({ sections: ['kaddish'], nusach }))
      const kaddish = content.find(
        (block): block is Extract<SheetBlock, { kind: 'kaddish' }> => block.kind === 'kaddish',
      )
      return kaddish!.sections.flatMap((chunk) => chunk.lines).map((line) => line.html)
    }
    const ashkenaz = kaddishOf('ashkenaz')
    const sefardVariant = kaddishOf('ashkenazSefard')
    // Same overall shape: both keep 7 sections (6 exchanges + the note).
    expect(sefardVariant).toHaveLength(ashkenaz.length)
    // The בעלמא mourner line gains the insertion; the congregation's אמן
    // response to it is untouched.
    expect(ashkenaz.find((html) => html.startsWith('בְּעָלְמָא'))).not.toContain('פֻּרְקָנֵה')
    expect(sefardVariant.find((html) => html.startsWith('בְּעָלְמָא'))).toContain(
      'וְיַצְמַח פֻּרְקָנֵה, וִיקָרֵב מְשִׁיחֵהּ',
    )
    // Every other line is byte-identical between the two variants.
    const withInsert = sefardVariant.find((html) => html.startsWith('בְּעָלְמָא'))!
    expect(sefardVariant.filter((html) => html !== withInsert)).toEqual(
      ashkenaz.filter((html) => !html.startsWith('בְּעָלְמָא')),
    )
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

  it('builds mishnayot from the deceased name letters (sofit forms kept), falling back to נשמה letters', () => {
    const named = buildSheetContent(baseSettings({ name: 'יוסף' }))
    const mishnayot = named.find((block) => block.kind === 'mishnayot')
    if (mishnayot?.kind === 'mishnayot') {
      expect(mishnayot.items.map((entry) => entry.letter)).toEqual(['י', 'ו', 'ס', 'ף'])
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

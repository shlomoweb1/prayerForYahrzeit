/**
 * P3-05 Bridge from the wizard URL query to the sheet model.
 *
 * WizardQuery is the round-trippable URL state; SheetSettings/SheetLayout are
 * what the content model and the renderer consume. This file is the single
 * place the two meet, so step 6 and step 7 (and the render pipeline later)
 * can never disagree.
 */

import { useMemo } from 'react'

import { buildLayout, SHEET_ELEMENT_FONTS, type SheetElementFonts, type SheetSettings } from '@/features/sheet/layout'
import type { SheetFontId, SheetLayout, SheetNusach } from '@/features/sheet/layout'
import { SHEET_FONTS } from '@/features/sheet/fonts'
import type { WizardQuery } from '@/features/wizard/wizard-query'

export function isSheetFontId(value: string): value is SheetFontId {
  return Object.prototype.hasOwnProperty.call(SHEET_FONTS, value)
}

function resolveFontId(value: string | undefined, fallback: SheetFontId): SheetFontId {
  return value && isSheetFontId(value) ? value : fallback
}

/** WizardQuery key holding the override for an element: `bsd` -> `fontBsd`,
 * `closingAvHaRachamim` -> `fontClosingAvHaRachamim`, etc. */
export function elementFontQueryKey<Element extends (typeof SHEET_ELEMENT_FONTS)[number]>(
  element: Element,
): `font${Capitalize<Element>}` {
  return `font${element.charAt(0).toUpperCase()}${element.slice(1)}` as `font${Capitalize<Element>}`
}

/** Per-element fonts: every element resolves to its `fontXxx` override when
 * set (and a real font id), otherwise to the single global `font`. */
function elementFontsFromQuery(search: WizardQuery, font: SheetFontId): SheetElementFonts {
  const fonts = {} as SheetElementFonts
  for (const element of SHEET_ELEMENT_FONTS) {
    fonts[element] = resolveFontId(search[elementFontQueryKey(element)] as string | undefined, font)
  }
  return fonts
}

/** Maps the wizard's two-level עדה/נוסח choice down to the single
 * `SheetNusach` the content/liturgy layer works with. Mizrahi has no
 * נוסח sub-choice and maps straight to the `sefard` liturgy set. */
export function deriveSheetNusach(search: Pick<WizardQuery, 'edah' | 'nusachAshkenaz'>): SheetNusach {
  if (search.edah === 'mizrahi') return 'sefard'
  return search.nusachAshkenaz === 'sefard' ? 'ashkenazSefard' : 'ashkenaz'
}

/** Build the sheet settings for a wizard query (in-memory every call). */
export function sheetSettingsFromQuery(search: WizardQuery): SheetSettings {
  const font = isSheetFontId(search.font) ? search.font : 'noto-serif'
  return {
    paper: search.paper,
    gender: search.gender,
    nusach: deriveSheetNusach(search),
    name: search.name || undefined,
    parent: search.parent || undefined,
    deathDate: search.deathDate,
    lineage: search.lineage,
    font,
    fonts: elementFontsFromQuery(search, font),
    lineDensity: search.lineDensity,
    nikud: search.nikud,
    deco: search.deco,
    acrostic: search.acrostic,
    blessing: search.blessing,
    hashkavaVariant: search.hashkavaVariant,
    kaddishResponseLabel: search.kaddishResponseLabel,
    elMalehPhrase: search.elMalehPhrase,
    sections: [...search.sections],
  }
}

/** Layout for the preview/render. */
export function sheetLayoutFromQuery(search: WizardQuery): SheetLayout {
  const font = isSheetFontId(search.font) ? search.font : 'noto-serif'
  return buildLayout(search.paper, font, { lineDensity: search.lineDensity })
}

/** Settings + layout for a step's render, stable while the query is stable. */
export function useSheetDraft(search: WizardQuery): { settings: SheetSettings; layout: SheetLayout } {
  return useMemo(() => {
    const settings = sheetSettingsFromQuery(search)
    return { settings, layout: sheetLayoutFromQuery(search) }
  }, [search])
}

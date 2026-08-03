/**
 * P3-05 Bridge from the wizard URL query to the sheet model.
 *
 * WizardQuery is the round-trippable URL state; SheetSettings/SheetLayout are
 * what the content model and the renderer consume. This file is the single
 * place the two meet, so step 6 and step 7 (and the render pipeline later)
 * can never disagree.
 */

import { useMemo } from 'react'

import { buildLayout, type SheetSettings } from '@/features/sheet/layout'
import type { SheetFontId, SheetLayout, SheetNusach } from '@/features/sheet/layout'
import { SHEET_FONTS } from '@/features/sheet/fonts'
import type { WizardQuery } from '@/features/wizard/wizard-query'

export function isSheetFontId(value: string): value is SheetFontId {
  return Object.prototype.hasOwnProperty.call(SHEET_FONTS, value)
}

/** Build the sheet settings for a wizard query (in-memory every call). */
export function sheetSettingsFromQuery(search: WizardQuery): SheetSettings {
  return {
    paper: search.paper,
    gender: search.gender,
    nusach: search.nusach as SheetNusach,
    name: search.name || undefined,
    parent: search.parent || undefined,
    font: isSheetFontId(search.font) ? search.font : 'noto-serif',
    nikud: search.nikud,
    deco: search.deco,
    acrostic: search.acrostic,
    blessing: search.blessing,
    sections: [...search.sections],
  }
}

/** Layout for the preview/render: share target uses the 1080×1920 canvas. */
export function sheetLayoutFromQuery(search: WizardQuery): SheetLayout {
  const font = isSheetFontId(search.font) ? search.font : 'noto-serif'
  const target = search.target === 'share' ? 'share' : 'print'
  return buildLayout(target, search.paper, font)
}

/** Settings + layout for a step's render, stable while the query is stable. */
export function useSheetDraft(search: WizardQuery): { settings: SheetSettings; layout: SheetLayout } {
  return useMemo(() => {
    const settings = sheetSettingsFromQuery(search)
    return { settings, layout: sheetLayoutFromQuery(search) }
  }, [search])
}

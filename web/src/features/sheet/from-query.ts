/**
 * P3-05 Bridge from the wizard URL query to the sheet model.
 *
 * WizardQuery is the round-trippable URL state; SheetSettings/SheetLayout are
 * what the content model and the renderer consume. This file is the single
 * place the two meet, so step 6 and step 7 (and the render pipeline later)
 * can never disagree.
 */

import { useMemo } from 'react'

import { buildLayout, type SheetFontRoles, type SheetSettings } from '@/features/sheet/layout'
import type { SheetFontId, SheetLayout, SheetNusach } from '@/features/sheet/layout'
import { SHEET_FONTS } from '@/features/sheet/fonts'
import type { WizardQuery } from '@/features/wizard/wizard-query'

export function isSheetFontId(value: string): value is SheetFontId {
  return Object.prototype.hasOwnProperty.call(SHEET_FONTS, value)
}

function resolveFontId(value: string | undefined, fallback: SheetFontId): SheetFontId {
  return value && isSheetFontId(value) ? value : fallback
}

/** Per-role fonts: in simple mode (or when a role override isn't set) every
 * role falls back to the single global `font` — advanced mode is the only
 * place role overrides can diverge from it. */
function fontRolesFromQuery(search: WizardQuery, font: SheetFontId): SheetFontRoles {
  if (search.editorMode !== 'advanced') {
    return { title: font, heading: font, body: font }
  }
  return {
    title: resolveFontId(search.fontTitle, font),
    heading: resolveFontId(search.fontHeading, font),
    body: resolveFontId(search.fontBody, font),
  }
}

/** Build the sheet settings for a wizard query (in-memory every call). */
export function sheetSettingsFromQuery(search: WizardQuery): SheetSettings {
  const font = isSheetFontId(search.font) ? search.font : 'noto-serif'
  return {
    paper: search.paper,
    gender: search.gender,
    nusach: search.nusach as SheetNusach,
    name: search.name || undefined,
    parent: search.parent || undefined,
    deathDate: search.deathDate,
    lineage: search.lineage,
    font,
    fontRoles: fontRolesFromQuery(search, font),
    lineDensity: search.lineDensity,
    nikud: search.nikud,
    deco: search.deco,
    acrostic: search.acrostic,
    blessing: search.blessing,
    hashkavaVariant: search.hashkavaVariant,
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

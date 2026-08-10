import { HDate } from '@hebcal/core'
import { z } from 'zod'

export const STEP_MIN = 1
export const STEP_MAX = 5

export const SECTIONS = [
  'psalms',
  'neshama',
  'kaddish',
  'mishnayot',
  'hashkava',
  'closing',
] as const

export const DIALOGS = ['print', 'settings', 'kaddish'] as const

/** Default section set: the עלייה לקבר (graveside) sheet - the format most
 * people printing from this app actually need. Everything else (mishnayot,
 * closing prayers) stays available but opt-in. */
export const DEFAULT_SECTIONS = ['psalms', 'neshama', 'kaddish', 'hashkava'] as const

const sectionsArray = z.array(z.enum(SECTIONS))

export const WizardQuery = z.object({
  step: z.coerce
    .number()
    .int()
    .transform((value) => Math.min(Math.max(value, STEP_MIN), STEP_MAX))
    .catch(STEP_MIN)
    .default(STEP_MIN),
  paper: z.enum(['a4', 'letter']).default('a4').catch('a4'),
  gender: z.enum(['male', 'female']).default('male').catch('male'),
  /**
   * Top-level עדה choice. Ashkenaz has a further נוסח sub-choice
   * (`nusachAshkenaz`); Mizrahi doesn't - it maps straight to the
   * `sefard` liturgy set. See `NusachSelection` below for the validity
   * rule that combines the two, and `deriveSheetNusach` in
   * features/sheet/from-query.ts for the mapping down to `SheetNusach`.
   */
  edah: z.enum(['ashkenaz', 'mizrahi']).default('ashkenaz').catch('ashkenaz'),
  /** Only meaningful when `edah === 'ashkenaz'`; unset/invalid otherwise. */
  nusachAshkenaz: z.enum(['ashkenaz', 'sefard']).optional().catch(undefined),
  name: z.string().max(100).optional().catch(undefined),
  parent: z.string().max(100).optional().catch(undefined),
  lineage: z.enum(['none', 'kohen', 'levi']).default('none').catch('none'),
  /**
   * Hebrew date of passing, stored as the Hebrew calendar's absolute day
   * count (R.D. - see `HDate.abs()`/`new HDate(rd)` in @hebcal/core), not
   * as separate day/month/year fields: one integer round-trips losslessly
   * through `HDate` (leap-year Adar I/II and all), and already bakes in
   * the before/after-sunset adjustment made on step 4. Optional - the step
   * is skippable like the rest of the wizard. Rejects (falls back to
   * unset, not an error - same `.catch()` policy as every other field)
   * any value in the future: a hand-edited URL can't be used to print a
   * date of death that hasn't happened, matching the day/month/year
   * pickers' own future-date guard on step 4.
   */
  deathDate: z.coerce
    .number()
    .int()
    .positive()
    .refine((value) => new HDate(value).greg().getTime() <= Date.now())
    .optional()
    .catch(undefined),
  font: z.string().min(1).default('noto-serif').catch('noto-serif'),
  /** Per-element font overrides (optional): every sheet element falls back to
   * the global `font` unless its own `fontXxx` key is set. The full element
   * list lives in SHEET_ELEMENT_FONTS (features/sheet/layout.ts); the mapping
   * from element -> query key is `font` + PascalCase(element). */
  fontBsd: z.string().min(1).optional().catch(undefined),
  fontSheetTitle: z.string().min(1).optional().catch(undefined),
  fontNameLine: z.string().min(1).optional().catch(undefined),
  fontSectionTitle: z.string().min(1).optional().catch(undefined),
  fontPsalmBadge: z.string().min(1).optional().catch(undefined),
  fontPsalmText: z.string().min(1).optional().catch(undefined),
  fontLetterBadge: z.string().min(1).optional().catch(undefined),
  fontLetterText: z.string().min(1).optional().catch(undefined),
  fontKaddishMourner: z.string().min(1).optional().catch(undefined),
  fontKaddishCongregation: z.string().min(1).optional().catch(undefined),
  fontMishnahBadge: z.string().min(1).optional().catch(undefined),
  fontMishnahText: z.string().min(1).optional().catch(undefined),
  fontBlessingText: z.string().min(1).optional().catch(undefined),
  fontElMalehText: z.string().min(1).optional().catch(undefined),
  fontHashkavaText: z.string().min(1).optional().catch(undefined),
  fontClosingDryBones: z.string().min(1).optional().catch(undefined),
  fontClosingAvHaRachamim: z.string().min(1).optional().catch(undefined),
  fontClosingParting: z.string().min(1).optional().catch(undefined),
  nikud: z.coerce.number().int().min(0).max(1).catch(1).default(1),
  deco: z.coerce.number().int().min(0).max(1).catch(1).default(1),
  acrostic: z.enum(['both', 'name', 'parent', 'none']).default('name').catch('name'),
  blessing: z.coerce.number().int().min(0).max(1).catch(0).default(0),
  hashkavaVariant: z.enum(['elMaleh', 'traditional', 'both']).default('elMaleh').catch('elMaleh'),
  kaddishResponseLabel: z
    .enum(['congregation', 'responders', 'none'])
    .default('congregation')
    .catch('congregation'),
  elMalehPhrase: z.enum(['charity', 'psalms']).default('psalms').catch('psalms'),
  /**
   * Hidden dev flag: forces the step-5 preview pane into the live HTML
   * editor-preview instead of the default Folio-rendered PDF viewer.
   * Deliberately has no UI affordance (no toggle, no label, no i18n key) -
   * `?editor=1` only.
   */
  editor: z.coerce.number().int().min(0).max(1).catch(0).default(0),
  lineDensity: z.enum(['tidy', 'normal', 'loose']).default('normal').catch('normal'),
  sections: z
    .union([
      sectionsArray,
      z
        .string()
        .transform((value) => value.split(','))
        .pipe(sectionsArray),
    ])
    .default([...DEFAULT_SECTIONS])
    .catch([...DEFAULT_SECTIONS]),
  dialog: z.enum(DIALOGS).optional().catch(undefined),
})

export type WizardQuery = z.infer<typeof WizardQuery>
export type WizardDialog = z.infer<typeof WizardQuery>['dialog']

/**
 * Validity rule for the two-level עדה/נוסח choice, kept as an actual
 * union (rather than a loose "is nusachAshkenaz set" check) so a Mizrahi
 * selection can never be read as requiring - or wrongly carrying - an
 * Ashkenaz נוסח. Gates step 2's Next button via `canAdvance` in
 * step-registry.tsx.
 */
export const NusachSelection = z.discriminatedUnion('edah', [
  z.object({ edah: z.literal('mizrahi') }),
  z.object({ edah: z.literal('ashkenaz'), nusachAshkenaz: z.enum(['ashkenaz', 'sefard']) }),
])

export function isNusachSelectionValid(search: Pick<WizardQuery, 'edah' | 'nusachAshkenaz'>): boolean {
  return NusachSelection.safeParse(search).success
}

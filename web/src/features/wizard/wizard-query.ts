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

export const DIALOGS = ['share', 'print', 'settings'] as const

const sectionsArray = z.array(z.enum(SECTIONS))

export const WizardQuery = z.object({
  step: z.coerce
    .number()
    .int()
    .transform((value) => Math.min(Math.max(value, STEP_MIN), STEP_MAX))
    .catch(STEP_MIN)
    .default(STEP_MIN),
  target: z.enum(['print', 'share', 'both']).default('print').catch('print'),
  paper: z.enum(['a4', 'letter']).default('a4').catch('a4'),
  gender: z.enum(['male', 'female']).default('male').catch('male'),
  nusach: z.enum(['ashkenaz', 'sefard']).default('ashkenaz').catch('ashkenaz'),
  name: z.string().max(100).optional().catch(undefined),
  parent: z.string().max(100).optional().catch(undefined),
  lineage: z.enum(['none', 'kohen', 'levi']).default('none').catch('none'),
  font: z.string().min(1).default('noto-serif').catch('noto-serif'),
  nikud: z.coerce.number().int().min(0).max(1).catch(1).default(1),
  deco: z.coerce.number().int().min(0).max(1).catch(1).default(1),
  acrostic: z.enum(['both', 'name', 'parent', 'none']).default('name').catch('name'),
  blessing: z.coerce.number().int().min(0).max(1).catch(0).default(0),
  hashkavaVariant: z.enum(['elMaleh', 'traditional', 'both']).default('elMaleh').catch('elMaleh'),
  editorMode: z.enum(['simple', 'advanced']).default('simple').catch('simple'),
  /**
   * Hidden dev flag: forces the step-5 preview pane into the live HTML
   * editor-preview instead of the default Folio-rendered PDF viewer. Not
   * `editorMode` (simple/advanced settings density) — an unrelated concept
   * that happens to share the word "editor". Deliberately has no UI
   * affordance (no toggle, no label, no i18n key) — `?editor=1` only.
   */
  editor: z.coerce.number().int().min(0).max(1).catch(0).default(0),
  lineDensity: z.enum(['tidy', 'normal', 'loose']).default('normal').catch('normal'),
  fontTitle: z.string().min(1).optional().catch(undefined),
  fontHeading: z.string().min(1).optional().catch(undefined),
  fontBody: z.string().min(1).optional().catch(undefined),
  sections: z
    .union([
      sectionsArray,
      z
        .string()
        .transform((value) => value.split(','))
        .pipe(sectionsArray),
    ])
    .default([...SECTIONS])
    .catch([...SECTIONS]),
  dialog: z.enum(DIALOGS).optional().catch(undefined),
})

export type WizardQuery = z.infer<typeof WizardQuery>
export type WizardDialog = z.infer<typeof WizardQuery>['dialog']

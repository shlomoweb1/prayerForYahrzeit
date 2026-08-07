import type { ComponentType } from 'react'

import { Step1Gender } from '@/features/wizard/steps/step-1-gender'
import { Step2Nusach } from '@/features/wizard/steps/step-2-nusach'
import { Step3Names } from '@/features/wizard/steps/step-3-names'
import { Step4DeathDate } from '@/features/wizard/steps/step-4-death-date'
import { Step5Review } from './steps/step-5-review'
// import { Step5Split } from '@/features/wizard/steps/step-5-split'
import { STEP_MAX, STEP_MIN, type WizardQuery } from '@/features/wizard/wizard-query'

import type { StepTitleKey } from '@/features/wizard/steps/step-shell'

export interface StepProps {
  search: WizardQuery
  setSearch: (patch: Partial<WizardQuery>) => void
}

export interface StepDefinition {
  number: number
  titleKey: StepTitleKey
  component: ComponentType<StepProps>
  /** Final step needs the full viewport width for the editor/preview tabs. */
  fullWidth?: boolean
  /** Gates the Next button — undefined means always advanceable. Steps
   * with a meaningful "skip" affordance of their own (step 4's date of
   * death) use this instead of silently letting Next carry an unset value
   * forward; the skip action itself still moves to the next step. */
  canAdvance?: (search: WizardQuery) => boolean
}

export const stepRegistry: StepDefinition[] = [
  { number: 1, titleKey: 'wizard.steps.1.title', component: Step1Gender },
  { number: 2, titleKey: 'wizard.steps.2.title', component: Step2Nusach },
  { number: 3, titleKey: 'wizard.steps.3.title', component: Step3Names },
  {
    number: 4,
    titleKey: 'wizard.steps.4.title',
    component: Step4DeathDate,
    canAdvance: (search) => search.deathDate !== undefined,
  },
  { number: 5, titleKey: 'wizard.steps.5.title', component: Step5Review, fullWidth: true },
]

export function getStep(step: number): StepDefinition {
  const clamped = Math.min(Math.max(step, STEP_MIN), STEP_MAX)
  return stepRegistry.find((entry) => entry.number === clamped) ?? stepRegistry[0]!
}

import type { ComponentType } from 'react'

import { Step1Gender } from '@/features/wizard/steps/step-1-gender'
import { Step2Nusach } from '@/features/wizard/steps/step-2-nusach'
import { Step3Names } from '@/features/wizard/steps/step-3-names'
import { Step4Target } from '@/features/wizard/steps/step-4-target'
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
}

export const stepRegistry: StepDefinition[] = [
  { number: 1, titleKey: 'wizard.steps.1.title', component: Step1Gender },
  { number: 2, titleKey: 'wizard.steps.2.title', component: Step2Nusach },
  { number: 3, titleKey: 'wizard.steps.3.title', component: Step3Names },
  { number: 4, titleKey: 'wizard.steps.4.title', component: Step4Target },
  { number: 5, titleKey: 'wizard.steps.5.title', component: Step5Review, fullWidth: true },
]

export function getStep(step: number): StepDefinition {
  const clamped = Math.min(Math.max(step, STEP_MIN), STEP_MAX)
  return stepRegistry.find((entry) => entry.number === clamped) ?? stepRegistry[0]!
}

import type { ComponentType } from 'react'

import { Step1Target } from '@/features/wizard/steps/step-1-target'
import { Step2Gender } from '@/features/wizard/steps/step-2-gender'
import { Step3Nusach } from '@/features/wizard/steps/step-3-nusach'
import { Step4Names } from '@/features/wizard/steps/step-4-names'
import { Step5Split } from '@/features/wizard/steps/step-5-split'
import { Step6Review } from '@/features/wizard/steps/step-6-review'
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
}

export const stepRegistry: StepDefinition[] = [
  { number: 1, titleKey: 'wizard.steps.1.title', component: Step1Target },
  { number: 2, titleKey: 'wizard.steps.2.title', component: Step2Gender },
  { number: 3, titleKey: 'wizard.steps.3.title', component: Step3Nusach },
  { number: 4, titleKey: 'wizard.steps.4.title', component: Step4Names },
  { number: 5, titleKey: 'wizard.steps.5.title', component: Step5Split },
  { number: 6, titleKey: 'wizard.steps.6.title', component: Step6Review },
]

export function getStep(step: number): StepDefinition {
  const clamped = Math.min(Math.max(step, STEP_MIN), STEP_MAX)
  return stepRegistry.find((entry) => entry.number === clamped) ?? stepRegistry[0]!
}

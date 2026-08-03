import { useTranslation } from 'react-i18next'
import * as React from 'react'

import { cn } from '@/lib/utils'
import { STEP_MAX } from '@/features/wizard/wizard-query'

type StepNumber = 1 | 2 | 3 | 4 | 5

export type StepTitleKey = `wizard.steps.${StepNumber}.title`
export type StepDescriptionKey = `wizard.steps.${StepNumber}.description`

interface StepShellProps {
  stepNumber: number
  titleKey: StepTitleKey
  descriptionKey?: StepDescriptionKey
  children: React.ReactNode
  className?: string
}

export function StepShell({
  stepNumber,
  titleKey,
  descriptionKey,
  children,
  className,
}: StepShellProps) {
  const { t } = useTranslation()

  if(stepNumber === 5) {
    return children
  }

  return (
    <fieldset className={cn('flex flex-col gap-4', className)}>
      <legend className="flex flex-col gap-1">
        <span className="text-muted-foreground text-sm">
          {t('wizard.stepIndicator', { current: stepNumber, total: STEP_MAX })}
        </span>
        <h2 data-step-heading tabIndex={-1} className="text-xl font-semibold outline-none">
          {t(titleKey)}
        </h2>
        {descriptionKey ? (
          <p className="text-muted-foreground text-sm">{t(descriptionKey)}</p>
        ) : null}
      </legend>
      {children}
    </fieldset>
  )
}

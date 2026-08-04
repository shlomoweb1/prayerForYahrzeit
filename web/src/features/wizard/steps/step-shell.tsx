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
  wrapperClassName?: string
}

export function StepShell({
  stepNumber,
  titleKey,
  descriptionKey,
  children,
  className,
  wrapperClassName,
}: StepShellProps) {
  const { t } = useTranslation()

  if (stepNumber === 5) {
    return children
  }

  return (
    <div role="group" className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-baseline justify-between gap-4 bg-card/80 mb-4 rounded-lg p-4 shadow-2xl shadow-amber-400">
        {descriptionKey ? (
          <p className="text-muted-foreground text-sm">{t(descriptionKey)}</p>
        ) : null}
        <span className="text-muted-foreground ms-auto shrink-0 text-sm">
          {t('wizard.stepIndicator', { current: stepNumber, total: STEP_MAX })}
        </span>
      </div>
      <div className={cn('flex flex-col gap-4 bg-card/80 rounded-lg p-4 shadow-2xl shadow-amber-400', wrapperClassName)}>
        {children}
      </div>
      <h2 data-step-heading tabIndex={-1} className="sr-only outline-none">
        {t(titleKey)}
      </h2>
    </div>
  )
}

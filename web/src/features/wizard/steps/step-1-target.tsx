import { Printer, Share2 } from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { OptionCard } from '@/components/ui/option-card'
import { RadioGroup } from '@/components/ui/radio-group'
import type { WizardQuery } from '@/features/wizard/wizard-query'
import { StepShell } from '@/features/wizard/steps/step-shell'

interface StepProps {
  search: WizardQuery
  setSearch: (patch: Partial<WizardQuery>) => void
}

const TARGET_ICONS: Record<WizardQuery['target'], React.ReactNode> = {
  print: <Printer className="size-6" strokeWidth={1.75} />,
  share: <Share2 className="size-6" strokeWidth={1.75} />,
  both: (
    <span className="relative inline-flex size-6 items-center justify-center">
      <Printer className="size-6" strokeWidth={1.75} />
      <span className="bg-card ring-card absolute -end-2 -bottom-2 flex size-4 items-center justify-center rounded-full ring-2">
        <Share2 className="size-3" strokeWidth={2} />
      </span>
    </span>
  ),
}

const PAPER_ASPECT_RATIO: Record<WizardQuery['paper'], number> = {
  a4: 210 / 297,
  letter: 215.9 / 279.4,
}

function PaperPreview({ aspectRatio }: { aspectRatio: number }) {
  return (
    <span
      className="border-current/25 flex w-10 flex-col justify-start gap-1 rounded-[2px] border p-1.5"
      style={{ aspectRatio }}
    >
      <span className="bg-current/20 block h-0.5 w-full rounded-full" />
      <span className="bg-current/20 block h-0.5 w-4/5 rounded-full" />
      <span className="bg-current/20 block h-0.5 w-full rounded-full" />
    </span>
  )
}

export function Step1Target({ search, setSearch }: StepProps) {
  const { t } = useTranslation()

  return (
    <StepShell
      stepNumber={1}
      titleKey="wizard.steps.1.title"
      descriptionKey="wizard.steps.1.description"
    >
      <RadioGroup
        value={search.target}
        onValueChange={(value) => setSearch({ target: value as WizardQuery['target'] })}
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        aria-label={t('wizard.labels.target')}
      >
        {(['print', 'share', 'both'] as const).map((target) => (
          <OptionCard
            key={target}
            value={target}
            icon={TARGET_ICONS[target]}
            title={t(`wizard.options.target.${target}`)}
            hint={t(`wizard.hints.target.${target}`)}
          />
        ))}
      </RadioGroup>
      {search.target !== 'share' ? (
        <div className="grid gap-2">
          <span className="text-sm font-medium">{t('wizard.labels.paper')}</span>
          <RadioGroup
            value={search.paper}
            onValueChange={(value) => setSearch({ paper: value as WizardQuery['paper'] })}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            aria-label={t('wizard.labels.paper')}
          >
            {(['a4', 'letter'] as const).map((paper) => (
              <OptionCard
                key={paper}
                value={paper}
                icon={<PaperPreview aspectRatio={PAPER_ASPECT_RATIO[paper]} />}
                title={t(`wizard.options.paper.${paper}`)}
                caption={t(`wizard.paperDimensions.${paper}`)}
                hint={t(`wizard.hints.paper.${paper}`)}
              />
            ))}
          </RadioGroup>
        </div>
      ) : null}
    </StepShell>
  )
}

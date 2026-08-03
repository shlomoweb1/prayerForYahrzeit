import { useTranslation } from 'react-i18next'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { WizardQuery } from '@/features/wizard/wizard-query'
import { StepShell } from '@/features/wizard/steps/step-shell'

interface StepProps {
  search: WizardQuery
  setSearch: (patch: Partial<WizardQuery>) => void
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
        onValueChange={(value) =>
          setSearch({ target: value as WizardQuery['target'] })
        }
      >
        {(['print', 'share', 'both'] as const).map((target) => (
          <div key={target} className="flex items-center gap-2">
            <RadioGroupItem value={target} id={`target-${target}`} />
            <Label htmlFor={`target-${target}`}>{t(`wizard.options.target.${target}`)}</Label>
          </div>
        ))}
      </RadioGroup>
      {search.target !== 'share' ? (
        <div className="grid gap-2">
          <Label>{t('wizard.labels.paper')}</Label>
          <Select
            value={search.paper}
            onValueChange={(value) => setSearch({ paper: value as WizardQuery['paper'] })}
          >
            <SelectTrigger className="w-full" aria-label={t('wizard.labels.paper')}>
              <SelectValue placeholder={t('wizard.labels.paper')} />
            </SelectTrigger>
            <SelectContent>
              {(['a4', 'letter'] as const).map((paper) => (
                <SelectItem key={paper} value={paper}>
                  {t(`wizard.options.paper.${paper}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}
    </StepShell>
  )
}

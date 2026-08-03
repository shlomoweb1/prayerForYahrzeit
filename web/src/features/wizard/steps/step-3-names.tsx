import { useTranslation } from 'react-i18next'

import { Input } from '@/components/ui/input'
import { OptionCard } from '@/components/ui/option-card'
import { RadioGroup } from '@/components/ui/radio-group'
import { filialWord, sheetHeaderLine } from '@/features/sheet/content'
import { sheetSettingsFromQuery } from '@/features/sheet/from-query'
import type { WizardQuery } from '@/features/wizard/wizard-query'
import { StepShell } from '@/features/wizard/steps/step-shell'

interface StepProps {
  search: WizardQuery
  setSearch: (patch: Partial<WizardQuery>) => void
}

const GENDER_AVATARS: Record<WizardQuery['gender'], string> = {
  male: 'icons/avatars/20215969031702585014.svg',
  female: 'icons/avatars/12363769451582967218.svg',
}

const LINEAGE_OPTIONS = ['kohen', 'levi', 'none'] as const

const LINEAGE_ICONS: Record<WizardQuery['lineage'], string> = {
  kohen: 'icons/lineage/choen.svg',
  levi: 'icons/lineage/levi.svg',
  none: 'icons/lineage/yisrael.svg',
}

export function Step3Names({ search, setSearch }: StepProps) {
  const { t } = useTranslation()
  const preview = sheetHeaderLine(sheetSettingsFromQuery(search))

  return (
    <StepShell
      stepNumber={3}
      titleKey="wizard.steps.3.title"
      descriptionKey="wizard.steps.3.description"
    >
      <div className="bg-card rounded-xl border p-4 shadow-sm sm:p-6">
        <div
          className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center"
          dir="rtl"
        >
          <div className="flex flex-1 items-center gap-2">
            <img
              src={GENDER_AVATARS[search.gender]}
              alt=""
              className="size-8 shrink-0 rounded-full border border-primary"
            />
            <Input
              id="wizard-name"
              dir="rtl"
              lang="he"
              autoComplete="off"
              aria-label={t('wizard.labels.name', { context: search.gender })}
              value={search.name ?? ''}
              onChange={(event) => setSearch({ name: event.target.value })}
              placeholder={t('wizard.placeholders.name', { context: search.gender })}
            />
          </div>
          <span className="text-center md:text-start text-muted-foreground shrink-0 text-sm font-medium">
            {filialWord(search.gender)}
          </span>
          <Input
            id="wizard-parent"
            dir="rtl"
            lang="he"
            autoComplete="off"
            aria-label={t('wizard.labels.parent')}
            className="flex-1"
            value={search.parent ?? ''}
            onChange={(event) => setSearch({ parent: event.target.value })}
            placeholder={t('wizard.placeholders.parent')}
          />
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          {t('wizard.hints.name', { context: search.gender })}
        </p>
      </div>
      <div className="grid gap-2">
        <span className="text-muted-foreground text-sm">{t('wizard.labels.lineage')}</span>
        <RadioGroup
          value={search.lineage}
          onValueChange={(value) => setSearch({ lineage: value as WizardQuery['lineage'] })}
          className="grid grid-cols-1 gap-3 sm:grid-cols-3"
          aria-label={t('wizard.labels.lineage')}
          dir="rtl"
        >
          {LINEAGE_OPTIONS.map((lineage) => (
            <OptionCard
              key={lineage}
              value={lineage}
              icon={<img src={LINEAGE_ICONS[lineage]} alt="" data-lineage={lineage} className="size-16 data-[lineage=kohen]:w-32 data-[lineage=levi]:w-12 data-[lineage=levi]:-rotate-45" />}
              title={t(`wizard.options.lineage.${lineage}`)}
              hint={t(`wizard.hints.lineage.${lineage}`)}
            />
          ))}
        </RadioGroup>
      </div>
      {search.name?.trim() ? (
        <div className="bg-muted/30 rounded-lg border px-4 py-3">
          <p className="text-muted-foreground text-xs">{t('wizard.labels.namePreview')}</p>
          <p dir="rtl" lang="he" className="font-serif text-lg text-center">
            {preview}
          </p>
        </div>
      ) : null}
    </StepShell>
  )
}

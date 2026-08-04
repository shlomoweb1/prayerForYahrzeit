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

const LINEAGE_OPTIONS = ['kohen', 'levi', 'none'] as const

const LINEAGE_IMAGES: Record<WizardQuery['lineage'], string> = {
  kohen: '/images/koen.png',
  levi: '/images/levi.png',
  none: '/images/yisrael.png',
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
      <div
        className="relative flex min-h-40 flex-col justify-center overflow-hidden rounded-xl border bg-cover bg-bottom p-4 shadow-sm sm:min-h-48 sm:p-6"
        style={{ backgroundImage: 'url(/images/hero.png)' }}
      >
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative">
          <div
            className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center"
            dir="rtl"
          >
            <div className="flex flex-1 items-center gap-2">
              <Input
                id="wizard-name"
                dir="rtl"
                lang="he"
                autoComplete="off"
                className="bg-white/95 backdrop-blur-sm"
                aria-label={t('wizard.labels.name', { context: search.gender })}
                value={search.name ?? ''}
                onChange={(event) => setSearch({ name: event.target.value })}
                placeholder={t('wizard.placeholders.name', { context: search.gender })}
              />
            </div>
            <span className="text-center md:text-start text-white shrink-0 rounded-md bg-black/30 px-2 py-1 text-sm font-medium backdrop-blur-sm">
              {filialWord(search.gender)}
            </span>
            <Input
              id="wizard-parent"
              dir="rtl"
              lang="he"
              autoComplete="off"
              aria-label={t('wizard.labels.parent')}
              className="flex-1 bg-white/95 backdrop-blur-sm"
              value={search.parent ?? ''}
              onChange={(event) => setSearch({ parent: event.target.value })}
              placeholder={t('wizard.placeholders.parent')}
            />
          </div>
          <p className="text-white/90 mt-2 w-fit rounded-md bg-black/30 px-2 py-1 text-xs backdrop-blur-sm">
            {t('wizard.hints.name', { context: search.gender })}
          </p>
        </div>
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
              image={LINEAGE_IMAGES[lineage]}
              title={t(`wizard.options.lineage.${lineage}`)}
              hint={t(`wizard.hints.lineage.${lineage}`)}
              className="aspect-[4/3]"
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

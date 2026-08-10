import { useTranslation } from 'react-i18next'

import { Input } from '@/components/ui/input'
import { OptionCard } from '@/components/ui/option-card'
import { RadioGroup } from '@/components/ui/radio-group'
import { filialWord, sheetHeaderLine } from '@/features/sheet/content'
import { sheetSettingsFromQuery } from '@/features/sheet/from-query'
import type { WizardQuery } from '@/features/wizard/wizard-query'
import { StepShell } from '@/features/wizard/steps/step-shell'
import { cn } from '@/lib/utils'

interface StepProps {
  search: WizardQuery
  setSearch: (patch: Partial<WizardQuery>) => void
}

/**
 * Material-style floating label: invisible at rest - the real placeholder
 * shows through in its normal spot - and fades in at the top-end corner
 * once focused or filled, so it never overlaps the placeholder text.
 * `text-align` itself can't be animated (the browser owns text layout
 * inside a native `<input>`), so animating this separate `<label>` sibling
 * is the standard, CSS-only way to get a settle/snap-into-place feel.
 * `:not(:placeholder-shown)` (true once there's a value, even unfocused)
 * keeps the label floated after blur if the field was filled in.
 */
function FloatingLabelInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  className,
}: {
  id: string
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <div className={cn('relative', className)}>
      <Input
        id={id}
        dir="rtl"
        lang="he"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="peer border-white/25 bg-black/40 text-white placeholder:text-white/50 backdrop-blur-md"
      />
      <label
        htmlFor={id}
        className={cn(
          'pointer-events-none absolute -top-2 inset-s-2 translate-y-1 rounded bg-black/70 px-1.5 text-[11px] text-white/80 opacity-0 backdrop-blur-sm transition-all duration-200',
          'peer-focus:translate-y-0 peer-focus:opacity-100',
          'peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:opacity-100',
        )}
      >
        {label}
      </label>
    </div>
  )
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
            <FloatingLabelInput
              id="wizard-name"
              className="flex-1"
              label={t('wizard.labels.name', { context: search.gender })}
              placeholder={t('wizard.placeholders.name', { context: search.gender })}
              value={search.name ?? ''}
              onChange={(value) => setSearch({ name: value })}
            />
            <span className="text-center md:text-start text-white shrink-0 rounded-md bg-black/30 px-2 py-1 text-sm font-medium backdrop-blur-sm">
              {filialWord(search.gender)}
            </span>
            <FloatingLabelInput
              id="wizard-parent"
              className="flex-1"
              label={t('wizard.labels.parent')}
              placeholder={t('wizard.placeholders.parent')}
              value={search.parent ?? ''}
              onChange={(value) => setSearch({ parent: value })}
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
              className="aspect-4/3"
            />
          ))}
        </RadioGroup>
      </div>
      
        <div className="bg-muted/30 rounded-lg border px-4 py-3">
          <p className="text-muted-foreground text-xs">{t('wizard.labels.namePreview')}</p>
          <p dir="rtl" lang="he" className="font-serif text-lg text-center">
            {search.name?.trim() ? preview : (<span className="blur-[1.8px]">פלוני אלמוני בן אברהם אבינו</span>)}
          </p>
        </div>
      
    </StepShell>
  )
}

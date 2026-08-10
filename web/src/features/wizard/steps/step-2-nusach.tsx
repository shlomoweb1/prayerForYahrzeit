import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CheckBadge, OptionCard } from '@/components/ui/option-card'
import { RadioGroup } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import type { WizardQuery } from '@/features/wizard/wizard-query'
import { StepShell } from '@/features/wizard/steps/step-shell'

interface StepProps {
  search: WizardQuery
  setSearch: (patch: Partial<WizardQuery>) => void
}

const EDAH_IMAGES: Record<WizardQuery['edah'], string> = {
  ashkenaz: '/images/Ashkenaz-torah.png',
  mizrahi: '/images/separadi-torah.png',
}

const NUSACH_ASHKENAZ_VALUES = ['ashkenaz', 'sefard'] as const

export function Step2Nusach({ search, setSearch }: StepProps) {
  const { t, i18n } = useTranslation()
  const [nusachMenuOpen, setNusachMenuOpen] = useState(false)

  const selectNusachAshkenaz = (nusach: (typeof NUSACH_ASHKENAZ_VALUES)[number]) => {
    setSearch({ edah: 'ashkenaz', nusachAshkenaz: nusach })
    setNusachMenuOpen(false)
  }

  return (
    <StepShell
      stepNumber={2}
      titleKey="wizard.steps.2.title"
      descriptionKey="wizard.steps.2.description"
    >
      <RadioGroup
        value={search.edah}
        onValueChange={(value) => {
          const edah = value as WizardQuery['edah']
          setSearch({ edah, nusachAshkenaz: edah === 'ashkenaz' ? search.nusachAshkenaz : undefined })
          if (edah !== 'ashkenaz') setNusachMenuOpen(false)
        }}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        aria-label={t('wizard.labels.edah')}
        dir={i18n.dir()}
      >
        {/* Ashkenaz's נוסח sub-choice lives as a backdrop that slides down
         * over the card on hover (desktop) or tap (mobile, via
         * nusachMenuOpen) - the card itself never grows, so picking it
         * never shifts the page. */}
        <RadioGroupPrimitive.Item value="ashkenaz" asChild>
          <div
            onClick={() => setNusachMenuOpen((open) => !open)}
            data-nusach-menu={nusachMenuOpen ? 'open' : 'closed'}
            className={cn(
              'group focus-visible:ring-ring/50 relative flex aspect-4/5 cursor-pointer flex-col overflow-hidden rounded-xl border text-start shadow-sm outline-none transition-colors focus-visible:ring-[3px]',
              'hover:border-light/50',
              'data-[state=checked]:border-light data-[state=checked]:ring-light data-[state=checked]:ring-1',
            )}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out group-hover:scale-110"
              style={{ backgroundImage: `url(${EDAH_IMAGES.ashkenaz})` }}
            />
            <RadioGroupPrimitive.Indicator asChild>
              <CheckBadge className="absolute top-2.5 inset-e-2.5 z-10 size-8" />
            </RadioGroupPrimitive.Indicator>

            {/* Rendered before the caption bar so plain DOM/paint order (no
             * z-index needed) keeps the caption on top of it once it slides
             * down - the caption must stay legible the whole time. */}
            <div
              className={cn(
                'absolute inset-0 flex items-center justify-center bg-black/75 backdrop-blur-sm',
                'origin-top -translate-y-full opacity-0 transition-all duration-200 ease-out',
                'group-hover:translate-y-0 group-hover:opacity-100',
                'group-data-[nusach-menu=open]:translate-y-0 group-data-[nusach-menu=open]:opacity-100',
              )}
            >
              <div
                role="group"
                aria-label={t('wizard.labels.nusachAshkenaz')}
                className="flex w-4/5 flex-col gap-2"
                onClick={(event) => event.stopPropagation()}
              >
                {NUSACH_ASHKENAZ_VALUES.map((nusach) => (
                  <button
                    key={nusach}
                    type="button"
                    aria-pressed={search.edah === 'ashkenaz' && search.nusachAshkenaz === nusach}
                    onClick={() => selectNusachAshkenaz(nusach)}
                    className={cn(
                      'w-full cursor-pointer rounded-lg border-2 px-6 py-3 text-sm font-semibold transition-colors',
                      search.edah === 'ashkenaz' && search.nusachAshkenaz === nusach
                        ? 'border-light bg-light/20 text-light'
                        : 'border-white/50 text-white hover:border-white',
                    )}
                  >
                    {t(`wizard.options.nusachAshkenaz.${nusach}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="group-data-[state=checked]:text-light relative mt-auto flex flex-col gap-0.5 bg-black/35 p-3 text-white backdrop-blur-md">
              {/* Sits at the caption's own top-left, physical `left` so it
               * doesn't flip sides under RTL - faded out while the נוסח
               * backdrop is open (hover or tap) since it'd be redundant
               * with the picker itself. */}
              {search.nusachAshkenaz ? (
                <span
                  className={cn(
                    'absolute -top-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-light backdrop-blur-md transition-opacity duration-150',
                    'group-hover:opacity-0 group-data-[nusach-menu=open]:opacity-0',
                  )}
                >
                  {t(`wizard.options.nusachAshkenaz.${search.nusachAshkenaz}`)}
                </span>
              ) : null}
              <span className="text-sm font-medium">{t('wizard.options.edah.ashkenaz')}</span>
              <span className="group-data-[state=checked]:text-light/80 text-xs leading-snug text-white/80">
                {t('wizard.hints.edah.ashkenaz')}
              </span>
            </div>
          </div>
        </RadioGroupPrimitive.Item>

        <OptionCard
          value="mizrahi"
          image={EDAH_IMAGES.mizrahi}
          title={t('wizard.options.edah.mizrahi')}
          hint={t('wizard.hints.edah.mizrahi')}
        />
      </RadioGroup>
    </StepShell>
  )
}

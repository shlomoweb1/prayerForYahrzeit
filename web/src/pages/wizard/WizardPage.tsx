import { getRouteApi } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { detectPaperFromIp } from '@/features/wizard/paper-geo'
import { getStep } from '@/features/wizard/step-registry'
import { STEP_MAX, STEP_MIN, WizardQuery } from '@/features/wizard/wizard-query'
import { SegmentedRadioGroup } from '@/features/sheet/SheetSettingsPanel'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const routeApi = getRouteApi('/wizard/')

export default function WizardPage() {
  const { t } = useTranslation()
  const search = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const step = getStep(search.step)
  const StepComponent = step.component

  const setSearch = (patch: Partial<WizardQuery>) => {
    void navigate({
      to: '/wizard',
      search: (prev) => ({ ...prev, ...patch }),
    })
  }

  const goToStep = (nextStep: number) => {
    setSearch({ step: nextStep })
  }

  useEffect(() => {
    document.querySelector<HTMLElement>('[data-step-heading]')?.focus()
  }, [search.step])

  // One-time smart default: nobody explicitly asked for a paper size in the
  // URL, so guess Letter for the handful of countries that use it - A4
  // (zod's static default) is already showing and stays put unless the
  // IP lookup positively identifies a Letter country.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('paper')) return
    let cancelled = false
    void detectPaperFromIp().then((paper) => {
      if (!cancelled && paper === 'letter') {
        void navigate({ to: '/wizard', search: (prev) => ({ ...prev, paper }), replace: true })
      }
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const dialogOpen = search.dialog !== undefined

  return (
    <div
      className={cn(
        'flex flex-col gap-6 rounded-lg p-6',
        step.fullWidth ? 'bg-card/90 w-full h-full min-h-0' : ' md:min-w-3xl',
      )}
    >
      <StepComponent search={search} setSearch={setSearch} />
      <div
        className={cn(
          'items-center justify-between gap-4 mt-4 bg-card/80 mb-4 rounded-lg p-4 shadow-2xl shadow-amber-400/90 shrink-0',
          step.fullWidth ? 'hidden' : 'flex',
        )}
      >
        <Button
          variant="outline"
          disabled={search.step <= STEP_MIN}
          onClick={() => goToStep(search.step - 1)}
        >
          {t('common.previous')}
        </Button>
        {step.number !== STEP_MAX && (
          <h2 className="text-base font-semibold">{t(step.titleKey)}</h2>
        )}
        {search.step !== STEP_MAX && (
        <Button
          disabled={search.step >= STEP_MAX || (step.canAdvance ? !step.canAdvance(search) : false)}
          onClick={() => goToStep(search.step + 1)}
        >
          {t('common.next')}
        </Button>
        )}
      </div>
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setSearch({ dialog: undefined })
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {search.dialog === 'print'
                ? t('wizard.dialog.print')
                : search.dialog === 'kaddish'
                  ? t('wizard.dialog.kaddish')
                  : t('wizard.dialog.settings')}
            </DialogTitle>
            <DialogDescription>
              {search.dialog === 'print'
                ? t('wizard.dialog.printDescription')
                : search.dialog === 'kaddish'
                  ? t('wizard.dialog.kaddishDescription')
                  : t('wizard.dialog.scaffoldNote')}
            </DialogDescription>
          </DialogHeader>
          {search.dialog === 'print' ? (
            <div className="flex justify-end gap-2">
              <Button onClick={() => window.print()}>{t('wizard.actions.print')}</Button>
            </div>
          ) : null}
          {search.dialog === 'kaddish' ? (
            <div className="grid gap-2">
              <Label htmlFor="kaddish-response-label">{t('wizard.labels.kaddishResponseLabel')}</Label>
              <SegmentedRadioGroup
                idPrefix="kaddish-dialog"
                name="kaddishResponseLabel"
                value={search.kaddishResponseLabel}
                onValueChange={(value) =>
                  setSearch({ kaddishResponseLabel: value as 'congregation' | 'responders' | 'none' })
                }
                options={['congregation', 'responders', 'none']}
                getLabel={(option) => t(`wizard.options.kaddishResponseLabel.${option}`)}
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

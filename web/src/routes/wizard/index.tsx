import { createFileRoute, useNavigate } from '@tanstack/react-router'
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
import { ShareActions } from '@/features/wizard/share-actions'
import { getStep } from '@/features/wizard/step-registry'
import { STEP_MAX, STEP_MIN, WizardQuery } from '@/features/wizard/wizard-query'

export const Route = createFileRoute('/wizard/')({
  validateSearch: WizardQuery,
  component: WizardPage,
})

function WizardPage() {
  const { t } = useTranslation()
  const search = Route.useSearch()
  const navigate = useNavigate()
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

  const dialogOpen = search.dialog !== undefined

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">{t('wizard.title')}</h1>
      <StepComponent search={search} setSearch={setSearch} />
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          disabled={search.step <= STEP_MIN}
          onClick={() => goToStep(search.step - 1)}
        >
          {t('common.previous')}
        </Button>
        <Button
          disabled={search.step >= STEP_MAX}
          onClick={() => goToStep(search.step + 1)}
        >
          {t('common.next')}
        </Button>
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
              {search.dialog === 'share'
                ? t('wizard.dialog.share')
                : search.dialog === 'print'
                  ? t('wizard.dialog.print')
                  : t('wizard.dialog.settings')}
            </DialogTitle>
            <DialogDescription>
              {search.dialog === 'share'
                ? t('wizard.dialog.shareDescription')
                : search.dialog === 'print'
                  ? t('wizard.dialog.printDescription')
                  : t('wizard.dialog.scaffoldNote')}
            </DialogDescription>
          </DialogHeader>
          {search.dialog === 'share' ? <ShareActions search={search} /> : null}
          {search.dialog === 'print' ? (
            <div className="flex justify-end gap-2">
              <Button onClick={() => window.print()}>{t('wizard.actions.print')}</Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

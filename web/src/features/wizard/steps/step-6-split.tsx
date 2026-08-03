/**
 * P3-05 Step 6 — split editor.
 *
 * Mobile-first: settings accordion on top, live preview below, sticky action
 * bar at the bottom. Desktop: settings panel beside the preview.
 *
 * Every setting is bound to the URL query, so the preview updates on the fly
 * and the step survives a reload.
 */

import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { useSheetDraft } from '@/features/sheet/from-query'
import { buildSheetContent } from '@/features/sheet/content'
import { SheetPreview } from '@/features/sheet/SheetPreview'
import { SheetSettingsPanel } from '@/features/sheet/SheetSettingsPanel'
import type { StepProps } from '@/features/wizard/step-registry'
import { StepShell } from '@/features/wizard/steps/step-shell'

export function Step6Split({ search, setSearch }: StepProps) {
  const { t } = useTranslation()
  const { settings, layout } = useSheetDraft(search)
  const content = buildSheetContent(settings)

  return (
    <StepShell
      stepNumber={6}
      titleKey="wizard.steps.6.title"
      descriptionKey="wizard.steps.6.description"
    >
      <div className="lg:grid lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-6">
        <SheetSettingsPanel search={search} setSearch={setSearch} />
        <div className="mt-4 lg:mt-0">
          <div className="rounded-md border bg-muted/30 p-2">
            <SheetPreview
              content={content}
              layout={layout}
              settings={settings}
              className="max-h-[70vh]"
            />
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 z-10 -mx-4 mt-2 flex justify-end border-t bg-background/95 px-4 py-3 backdrop-blur">
        <Button onClick={() => setSearch({ step: 7 })}>{t('common.next')}</Button>
      </div>
    </StepShell>
  )
}

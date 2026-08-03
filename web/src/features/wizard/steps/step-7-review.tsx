/**
 * P3-05 Step 7 — review and download.
 *
 * Shows the final sheet (scaled preview on screen, natural-size copy for
 * print) with the action bar: print, download PDF, share, save to account.
 *
 * Print: the natural-size copy sits off-screen on the left, the @page override
 * comes from the layout, and the visibility media rules hide the rest of the
 * app while revealing the print area at the page origin. The pages are exact
 * A4/Letter and carry page-break-before between them.
 *
 * Download/share/save are stubs until the Folio render pipeline lands
 * (P4-01); they render a TODO-for-phase-5 note.
 */

import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { useSheetDraft } from '@/features/sheet/from-query'
import { buildSheetContent } from '@/features/sheet/content'
import { SheetDocument } from '@/features/sheet/sheet-document'
import { SheetPreview } from '@/features/sheet/SheetPreview'
import type { StepProps } from '@/features/wizard/step-registry'
import { StepShell } from '@/features/wizard/steps/step-shell'

export function Step7Review({ search }: StepProps) {
  const { t } = useTranslation()
  const { settings, layout } = useSheetDraft(search)
  const content = buildSheetContent(settings)

  const printCss = [
    layout.page.pageCss,
    `.izkor-print-area{position:absolute;top:0;left:-200vw;width:${layout.page.widthPx}px;}`,
    '@media print{.izkor-print-area{left:0;width:auto;}body *{visibility:hidden !important;}.izkor-print-area,.izkor-print-area *{visibility:visible !important;}}',
  ].join('\n')

  return (
    <StepShell
      stepNumber={7}
      titleKey="wizard.steps.7.title"
      descriptionKey="wizard.steps.7.description"
    >
      <style>{printCss}</style>
      <div className="print:hidden">
        <div className="rounded-md border bg-muted/30 p-2">
          <SheetPreview
            content={content}
            layout={layout}
            settings={settings}
            className="max-h-[65vh]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => window.print()}>{t('wizard.actions.print')}</Button>
          <Button variant="outline" disabled title={t('wizard.dialog.scaffoldNote')}>
            {t('wizard.actions.download')}
          </Button>
          <Button variant="outline" disabled title={t('wizard.dialog.scaffoldNote')}>
            {t('wizard.actions.share')}
          </Button>
          <Button variant="outline" disabled title={t('wizard.dialog.scaffoldNote')}>
            {t('wizard.actions.save')}
          </Button>
        </div>
        <p className="text-muted-foreground text-sm" data-todo-phase-5>
          TODO-for-phase-5: download / share / save wired to the Folio render
          pipeline.
        </p>
      </div>
      <div className="izkor-print-area">
        <SheetDocument content={content} layout={layout} settings={settings} />
      </div>
    </StepShell>
  )
}

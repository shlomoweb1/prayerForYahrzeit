/**
 * P3-05 Step 7 — review and download.
 *
 * Shows the final sheet (scaled preview on screen, natural-size copy for
 * print) with the action bar: print, download PDF, share, save to account.
 *
 * Print uses the browser print dialog with an @page override from the layout;
 * the natural-size pages are already exact A4/Letter and carry
 * page-break-before between them. Download renders the sheet off-screen,
 * sends it to the Folio wasm worker and saves the PDF blob.
 *
 * Share/save are stubs until their services land (P4-01); they render a
 * TODO-for-phase-5 note.
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { folioClient } from '@/features/folio/folio-client'
import { useSheetDraft } from '@/features/sheet/from-query'
import { buildSheetContent } from '@/features/sheet/content'
import { SheetDocument } from '@/features/sheet/sheet-document'
import { SheetPreview } from '@/features/sheet/SheetPreview'
import { renderSheetHTML } from '@/features/render/renderSheetHTML'
import type { StepProps } from '@/features/wizard/step-registry'
import { StepShell } from '@/features/wizard/steps/step-shell'

function base64ToBytes(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

export function Step7Review({ search }: StepProps) {
  const { t } = useTranslation()
  const { settings, layout } = useSheetDraft(search)
  const content = buildSheetContent(settings)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const printCss = [
    layout.page.pageCss,
    `.izkor-print-area{position:absolute;top:0;left:-200vw;width:${layout.page.widthPx}px;}`,
    '@media print{.izkor-print-area{left:0;width:auto;}body *{visibility:hidden !important;}.izkor-print-area,.izkor-print-area *{visibility:visible !important;}}',
  ].join('\n')

  const handleDownload = async () => {
    setBusy(true)
    setError(null)
    try {
      const pdfTitle = `יזכור ${search.name?.trim() ?? ''}`.trim()
      const html = await renderSheetHTML({
        content,
        layout,
        settings,
        pdfTitle,
      })
      const result = await folioClient.render(html, {
        pageSize: layout.page.label,
        pdfTitle,
        pdfProfile: '',
      })
      const blob = new Blob([base64ToBytes(result.pdf)], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `yizkor-${(search.name ?? 'sheet').trim().replaceAll(/\s+/g, '-')}.pdf`
      anchor.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(String((err as Error)?.message ?? err))
    } finally {
      setBusy(false)
    }
  }

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
          <Button onClick={() => void handleDownload()} disabled={busy}>
            {busy ? t('wizard.actions.downloading') : t('wizard.actions.download')}
          </Button>
          <Button variant="outline" disabled title={t('wizard.dialog.scaffoldNote')}>
            {t('wizard.actions.share')}
          </Button>
          <Button variant="outline" disabled title={t('wizard.dialog.scaffoldNote')}>
            {t('wizard.actions.save')}
          </Button>
        </div>
        {error ? (
          <p className="text-destructive text-sm" role="alert">
            {t('wizard.errors.render', { message: error })}
          </p>
        ) : null}
        <p className="text-muted-foreground text-sm" data-todo-phase-5>
          TODO-for-phase-5: share / save wired to their services.
        </p>
      </div>
      <div className="izkor-print-area">
        <SheetDocument content={content} layout={layout} settings={settings} />
      </div>
    </StepShell>
  )
}

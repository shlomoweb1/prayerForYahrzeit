/**
 * P3-05/P6-04 Step 5 — split editor + review/download, as tabs.
 *
 * Editor and preview used to render side by side; in practice that meant
 * showing the same information twice on any screen narrow enough that the
 * preview had to shrink to fit. A tabbed layout (Folio-playground style)
 * gives each its full width instead, and removes the need for a separate
 * "review" step — the Preview tab already carries the print/download/share
 * actions, so there is nothing left for a "next" step to advance to.
 *
 * Print uses the browser print dialog with an @page override from the
 * layout; the natural-size pages are already exact A4/Letter and carry
 * page-break-before between them. Download renders the sheet off-screen,
 * sends it to the Folio wasm worker and saves the PDF blob (File System
 * Access API when available, `<a download>` fallback).
 *
 * Share (P6-04) uses the Web Share API Level 2 file share when supported
 * (native share sheet, incl. WhatsApp on mobile); otherwise it downloads the
 * PDF and copies the settings link. Saving to an account is a Phase 5
 * (Firebase) feature — kept as a visible stub below (TODO(phase-5)).
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSheetDraft } from '@/features/sheet/from-query'
import { buildSheetContent } from '@/features/sheet/content'
import { SheetDocument } from '@/features/sheet/sheet-document'
import { SheetPreview } from '@/features/sheet/SheetPreview'
import { SheetSettingsPanel } from '@/features/sheet/SheetSettingsPanel'
import { renderPdf, downloadPdf, performSheetShare } from '@/features/wizard/sheet-actions'
import type { StepProps } from '@/features/wizard/step-registry'
import { StepShell } from '@/features/wizard/steps/step-shell'

export function Step5Split({ search, setSearch }: StepProps) {
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
      const { blob, filename } = await renderPdf(search)
      await downloadPdf(blob, filename)
    } catch (err) {
      setError(String((err as Error)?.message ?? err))
    } finally {
      setBusy(false)
    }
  }

  const handleShare = async () => {
    setBusy(true)
    setError(null)
    try {
      const outcome = await performSheetShare(search)
      if (outcome === 'shared') toast(t('wizard.toasts.shareSuccess'))
      else if (outcome === 'fallback') toast(t('wizard.fallback.shareUnsupported'))
    } catch (err) {
      setError(String((err as Error)?.message ?? err))
    } finally {
      setBusy(false)
    }
  }

  const saveNote = t('wizard.dialog.saveNote')

  return (
    <StepShell stepNumber={5} titleKey="wizard.steps.5.title" descriptionKey="wizard.steps.5.description">
      <style>{printCss}</style>
      <Tabs defaultValue="editor" className="print:hidden">
        <TabsList>
          <TabsTrigger value="editor">{t('wizard.tabs.editor')}</TabsTrigger>
          <TabsTrigger value="preview">{t('wizard.tabs.preview')}</TabsTrigger>
        </TabsList>
        <TabsContent value="editor">
          <div className="rounded-md border bg-muted/30 p-4">
            <SheetSettingsPanel search={search} setSearch={setSearch} />
          </div>
        </TabsContent>
        <TabsContent value="preview" className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => window.print()}>{t('wizard.actions.print')}</Button>
            <Button onClick={() => void handleDownload()} disabled={busy}>
              {busy ? t('wizard.actions.downloading') : t('wizard.actions.download')}
            </Button>
            <Button variant="outline" onClick={() => void handleShare()} disabled={busy}>
              {busy ? t('wizard.actions.downloading') : t('wizard.actions.share')}
            </Button>
            {/* TODO(phase-5): Firebase account save (Phase 5 skipped — keep stub). */}
            <Button variant="outline" disabled title={saveNote}>
              {t('wizard.actions.save')}
            </Button>
          </div>
          {error ? (
            <p className="text-destructive text-sm" role="alert">
              {t('wizard.errors.render', { message: error })}
            </p>
          ) : null}
          <p className="text-muted-foreground text-sm" data-todo-phase-5>
            {saveNote}
          </p>
          <div className="rounded-md border bg-muted/30 p-2">
            <SheetPreview content={content} layout={layout} settings={settings} className="h-[75vh]" />
          </div>
        </TabsContent>
      </Tabs>
      <div className="izkor-print-area">
        <SheetDocument content={content} layout={layout} settings={settings} />
      </div>
    </StepShell>
  )
}

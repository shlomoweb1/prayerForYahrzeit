/**
 * P6-04 Share actions for the share dialog (opened via `?dialog=share`).
 *
 * Renders the PDF then hands it to the native share sheet; on unsupported
 * browsers it downloads the file and copies the settings link. Copy-link
 * and WhatsApp buttons always available. Firebase-backed account links
 * belong to Phase 5 — the save stub in step 7 keeps the TODO(phase-5) tag.
 */

import { CheckIcon, DownloadIcon, LinkIcon, MessageCircleIcon, Share2Icon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  copySheetLink,
  downloadPdf,
  performSheetShare,
  renderPdf,
  whatsappShareUrl,
} from '@/features/wizard/sheet-actions'
import type { WizardQuery } from '@/features/wizard/wizard-query'

interface ShareActionsProps {
  search: WizardQuery
}

export function ShareActions({ search }: ShareActionsProps) {
  const { t } = useTranslation()
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleShareFile = async () => {
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

  const handleCopyLink = async () => {
    setError(null)
    const ok = await copySheetLink()
    if (ok) {
      setCopied(true)
      toast(t('wizard.toasts.linkCopied'))
      window.setTimeout(() => setCopied(false), 2000)
    } else {
      setError(String(t('wizard.toasts.shareFailed')))
    }
  }

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

  const handleWhatsapp = () => {
    window.open(whatsappShareUrl(), '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => void handleShareFile()} disabled={busy}>
          <Share2Icon className="size-4" />
          {busy ? t('wizard.actions.downloading') : t('wizard.actions.share')}
        </Button>
        <Button variant="outline" onClick={() => void handleCopyLink()}>
          {copied ? <CheckIcon className="size-4" /> : <LinkIcon className="size-4" />}
          {t('wizard.actions.copyLink')}
        </Button>
        <Button variant="outline" onClick={handleWhatsapp}>
          <MessageCircleIcon className="size-4" />
          {t('wizard.actions.whatsapp')}
        </Button>
        <Button variant="outline" onClick={() => void handleDownload()} disabled={busy}>
          <DownloadIcon className="size-4" />
          {t('wizard.actions.download')}
        </Button>
      </div>
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {t('wizard.errors.render', { message: error })}
        </p>
      ) : null}
    </div>
  )
}

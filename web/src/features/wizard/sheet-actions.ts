/**
 * P6-04 Share / download / print actions for the wizard (step 7 + dialogs).
 *
 * No Firebase here — Phase 5 is skipped. Sharing is Web Share API Level 2
 * (PDF file → native share sheet, incl. WhatsApp on mobile) with a
 * download + copy-link fallback for browsers without file sharing.
 * Account saving stays a stub elsewhere (TODO(phase-5)).
 */

import { folioClient } from '@/features/folio/folio-client'
import { renderSheetHTML } from '@/features/render/renderSheetHTML'
import { buildSheetContent } from '@/features/sheet/content'
import { sheetLayoutFromQuery, sheetSettingsFromQuery } from '@/features/sheet/from-query'
import type { WizardQuery } from '@/features/wizard/wizard-query'

/**
 * Filename scheme: `izkor-<name>.pdf` for print layouts and
 * `izkor-<name>-mobile.pdf` for the share (1080×1920) canvas.
 *
 * The name is the Hebrew name exactly as the user typed it (normalized,
 * punctuation stripped). Choice: Hebrew filenames are well supported on
 * Windows/macOS/iOS/Android, and we have no offline transliteration source —
 * transliterating would invent a name the user never wrote.
 */
export function sheetFilename(search: WizardQuery): string {
  const layout = sheetLayoutFromQuery(search)
  const base = sanitizeFilenamePart(search.name)
  const suffix = layout.target === 'share' ? '-mobile' : ''
  return `izkor-${base}${suffix}.pdf`
}

export function sanitizeFilenamePart(name: string | undefined): string {
  const trimmed = (name ?? '').trim()
  if (!trimmed) return 'sheet'
  const cleaned = trimmed
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replaceAll(/\s+/g, '-')
    .replaceAll(/-+/g, '-')
  return cleaned.slice(0, 60) || 'sheet'
}

function base64ToBytes(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

/** Render the sheet to a PDF blob + the file name it should be saved as. */
export async function renderPdf(search: WizardQuery): Promise<{ blob: Blob; filename: string }> {
  const settings = sheetSettingsFromQuery(search)
  const layout = sheetLayoutFromQuery(search)
  const content = buildSheetContent(settings)
  const pdfTitle = `יזכור ${search.name?.trim() ?? ''}`.trim()
  const html = await renderSheetHTML({ content, layout, settings, pdfTitle })
  const result = await folioClient.render(html, {
    pageSize: layout.page.label,
    pdfTitle,
    pdfProfile: '',
  })
  const blob = new Blob([base64ToBytes(result.pdf)], { type: 'application/pdf' })
  return { blob, filename: sheetFilename(search) }
}

interface SaveFilePickerHandle {
  createWritable(): Promise<{ write(data: Blob): Promise<void>; close(): Promise<void> }>
}

interface SaveFilePickerOptions {
  suggestedName?: string
  types?: { description: string; accept: Record<string, string[]> }[]
}

type SaveFilePickerFn = (options?: SaveFilePickerOptions) => Promise<SaveFilePickerHandle>

function getSaveFilePicker(): SaveFilePickerFn | undefined {
  return (
    globalThis as { showSaveFilePicker?: SaveFilePickerFn }
  ).showSaveFilePicker
}

/**
 * Download via the File System Access API when available
 * (native save dialog, real file name), falling back to an `<a download>`.
 */
export async function downloadPdf(blob: Blob, filename: string): Promise<void> {
  const picker = getSaveFilePicker()
  if (picker) {
    try {
      const handle = await picker({
        suggestedName: filename,
        types: [{ description: 'PDF', accept: { 'application/pdf': ['.pdf'] } }],
      })
      const writable = await handle.createWritable()
      await writable.write(blob)
      await writable.close()
      return
    } catch (err) {
      // AbortError = user dismissed the save dialog; do nothing.
      if (err instanceof DOMException && err.name === 'AbortError') return
      // Any other picker failure: fall through to the anchor download.
    }
  }
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

type WebShareNavigator = Navigator & {
  canShare?: (data: { files?: File[] }) => boolean
  share?: (data: { files?: File[]; title?: string }) => Promise<void>
}

/**
 * Share the PDF through the native share sheet (Web Share API Level 2).
 * Returns 'shared' | 'unsupported' (no file sharing) | 'aborted' (user
 * dismissed the sheet). Callers run the fallback on 'unsupported'.
 */
export async function sharePdfFile(
  blob: Blob,
  filename: string,
): Promise<'shared' | 'unsupported' | 'aborted'> {
  const navigatorWithShare = navigator as WebShareNavigator
  const file = new File([blob], filename, { type: 'application/pdf' })
  if (
    typeof navigatorWithShare.share === 'function' &&
    (!navigatorWithShare.canShare || navigatorWithShare.canShare({ files: [file] }))
  ) {
    try {
      await navigatorWithShare.share({ files: [file], title: filename })
      return 'shared'
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return 'aborted'
      return 'unsupported'
    }
  }
  return 'unsupported'
}

/**
 * The sheet's settings live in the URL — this is the shareable link
 * (without the `dialog` param, which is UI state, not sheet content).
 */
export function shareableUrl(): string {
  const url = new URL(window.location.href)
  url.searchParams.delete('dialog')
  return url.toString()
}

/** Copy the shareable link; resolves true on success. */
export async function copySheetLink(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(shareableUrl())
    return true
  } catch {
    return false
  }
}

/** WhatsApp share intent (link only — the PDF rides the file share sheet). */
export function whatsappShareUrl(): string {
  return `https://wa.me/?text=${encodeURIComponent(shareableUrl())}`
}

/**
 * Full share flow: render → native file share; on unsupported browsers
 * download the PDF + copy the settings link (toast handled by the caller).
 */
export async function performSheetShare(
  search: WizardQuery,
): Promise<'shared' | 'fallback' | 'aborted'> {
  const { blob, filename } = await renderPdf(search)
  const outcome = await sharePdfFile(blob, filename)
  if (outcome === 'unsupported') {
    await downloadPdf(blob, filename)
    await copySheetLink()
    return 'fallback'
  }
  return outcome
}

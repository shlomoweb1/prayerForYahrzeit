/**
 * P6-04 Download / print actions for the wizard (final step + dialogs).
 *
 * No Firebase here — Phase 5 is skipped. Account saving stays a stub
 * elsewhere (TODO(phase-5)).
 */

import { folioClient } from '@/features/folio/folio-client'
import { renderSheetHTML } from '@/features/render/renderSheetHTML'
import { buildSheetContent } from '@/features/sheet/content'
import { sheetLayoutFromQuery, sheetSettingsFromQuery } from '@/features/sheet/from-query'
import type { WizardQuery } from '@/features/wizard/wizard-query'

/**
 * Filename scheme: `izkor-<name>.pdf`.
 *
 * The name is the Hebrew name exactly as the user typed it (normalized,
 * punctuation stripped). Choice: Hebrew filenames are well supported on
 * Windows/macOS/iOS/Android, and we have no offline transliteration source —
 * transliterating would invent a name the user never wrote.
 */
export function sheetFilename(search: WizardQuery): string {
  const base = sanitizeFilenamePart(search.name)
  return `izkor-${base}.pdf`
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

/**
 * Dev-only debug export: the exact standalone HTML document handed to the
 * Folio worker (same capture as `renderPdf`, minus the wasm render step) —
 * open it directly in Node/a browser to debug pagination or CSS issues
 * without going through wasm.
 */
export async function exportSheetHtml(search: WizardQuery): Promise<{ blob: Blob; filename: string }> {
  const settings = sheetSettingsFromQuery(search)
  const layout = sheetLayoutFromQuery(search)
  const content = buildSheetContent(settings)
  const pdfTitle = `יזכור ${search.name?.trim() ?? ''}`.trim()
  const html = await renderSheetHTML({ content, layout, settings, pdfTitle })
  const blob = new Blob([html], { type: 'text/html' })
  const filename = sheetFilename(search).replace(/\.pdf$/, '.html')
  return { blob, filename }
}

/** Plain `<a download>` — no need for the save-file-picker ceremony for a debug artifact. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
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


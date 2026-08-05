/**
 * Native browser PDF embed for the step-5 preview pane's default (Folio) mode.
 *
 * Deliberately a plain `<embed>`, not a custom PDF.js viewer — the ask is the
 * browser's own built-in PDF plugin/UI (print button, zoom, page nav and
 * all), not a bespoke reader. The object URL lifecycle (create/revoke) is
 * owned by the caller (step-5-review.tsx), which is also what debounces and
 * triggers the Folio re-render — this component only ever renders whatever
 * URL it's handed.
 */
import { cn } from '@/lib/utils'

export interface PdfViewerProps {
  url: string
  className?: string
}

export function PdfViewer({ url, className }: PdfViewerProps) {
  return (
    <embed
      type="application/pdf"
      src={url}
      className={cn('h-full w-full', className)}
      aria-label="PDF preview"
    />
  )
}

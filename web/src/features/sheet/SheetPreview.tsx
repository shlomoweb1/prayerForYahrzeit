/**
 * P3-04 SheetPreview: mm-accurate preview of the full sheet.
 *
 * Renders the multi-page SheetDocument at natural pixel size (A4/Letter or
 * the 1080×1920 share canvas) inside a scale-to-fit wrapper. The same
 * document markup is what the off-screen capture hands to the Folio worker,
 * so the preview and the PDF can never drift.
 */

import { useCallback, useState } from 'react'

import { PreviewScaleWrapper } from '@/features/sheet/PreviewScaleWrapper'
import { SheetDocument } from '@/features/sheet/sheet-document'
import type { SheetBlock } from '@/features/sheet/content'
import type { SheetLayout, SheetSettings } from '@/features/sheet/layout'

export interface SheetPreviewProps {
  content: SheetBlock[]
  layout: SheetLayout
  settings: SheetSettings
  className?: string
}

export function SheetPreview({ content, layout, settings, className }: SheetPreviewProps) {
  const [totalHeight, setTotalHeight] = useState(0)
  const handleMeasure = useCallback((height: number) => {
    setTotalHeight(height)
  }, [])

  return (
    <PreviewScaleWrapper
      width={layout.page.widthPx}
      height={Math.max(totalHeight, 1)}
      className={className}
    >
      <div className="sheet-preview-pages">
        <SheetDocument
          content={content}
          layout={layout}
          settings={settings}
          onMeasure={handleMeasure}
        />
      </div>
    </PreviewScaleWrapper>
  )
}

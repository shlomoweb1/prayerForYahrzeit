/**
 * P3-04 PreviewScaleWrapper: scale-to-fit container for mm-accurate previews.
 *
 * The child is laid out at its natural size (e.g. 794×1123 px = A4 @96dpi)
 * and scaled down via a CSS transform so the preview always matches the
 * printed PDF pixel-for-pixel. The wrapper's own box is sized to the scaled
 * dimensions so scrollbars and centering behave.
 */

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

export interface PreviewScaleWrapperProps {
  width: number
  height: number
  children: ReactNode
  className?: string
}

export function PreviewScaleWrapper({ width, height, children, className }: PreviewScaleWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)
  const [dims, setDims] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const update = () => {
      const rect = container.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0 || width <= 0 || height <= 0) return
      const next = Math.min(1, (rect.width - 16) / width, (rect.height - 16) / height)
      setScale(next)
      setDims({ width: width * next, height: height * next })
    }

    update()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(update)
    observer.observe(container)
    return () => observer.disconnect()
  }, [width, height])

  return (
    <div ref={containerRef} className={cn('relative overflow-auto', className)}>
      <div
        className="mx-auto"
        style={{ width: dims.width || width, height: dims.height || height, position: 'relative' }}
      >
        <div
          style={{
            width,
            height,
            transform: scale > 0 ? `scale(${scale})` : undefined,
            transformOrigin: 'top left',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

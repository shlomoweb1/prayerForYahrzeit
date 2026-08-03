/**
 * P3-04 PreviewScaleWrapper: scale-to-fit container for mm-accurate previews.
 *
 * The child is laid out at its natural size (e.g. 794×1123 px = A4 @96dpi)
 * and scaled down via a CSS transform so the preview always matches the
 * printed PDF pixel-for-pixel.
 *
 * The outer box's own size must come from the caller (a fixed height class,
 * e.g. `h-[70vh]`, not `max-h-*`) — it cannot be derived from the scaled
 * child, since the child's size depends on the scale, which depends on the
 * outer box's rect. Measuring the box we're about to resize from its own
 * previous render is a circular loop that collapses to ~0px on first paint
 * and never recovers.
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
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const update = () => {
      const rect = container.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0 || width <= 0 || height <= 0) return
      const next = Math.min(1, (rect.width - 16) / width, (rect.height - 16) / height)
      setScale(next > 0 ? next : 1)
    }

    update()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(update)
    observer.observe(container)
    return () => observer.disconnect()
  }, [width, height])

  return (
    <div ref={containerRef} className={cn('relative overflow-auto', className)}>
      <div className="mx-auto" style={{ width: width * scale, height: height * scale }}>
        <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

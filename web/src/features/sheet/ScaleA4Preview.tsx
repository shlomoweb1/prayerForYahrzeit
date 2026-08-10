/**
 * Scale-to-fit wrapper for the A4 page stack, ported from tziyun-berga's
 * `scaleA4preview.tsx`. Same core idea: measure the *container* (a box whose
 * width comes from the surrounding flex layout, not from this component) and
 * scale the content down to fit - never scale up past 1:1, so the sheet
 * always reads at real print size on anything wide enough for it.
 *
 * One addition over the original: `transform: scale()` only changes paint,
 * not layout - the unscaled content still occupies its full natural box, so
 * without correcting for that the scroll container is left with dead space
 * below/right of the visibly-shrunk pages. The extra sizing div here
 * (`width/height: natural * scale`) reserves exactly the visible footprint
 * instead. `content.scrollWidth/scrollHeight` are read pre-transform (CSS
 * transforms don't affect layout metrics), so this measurement isn't
 * circular with the scale it feeds into.
 *
 * That sizing div only lines up with what actually gets painted if the
 * transform's origin is the same corner the sizing div is anchored to
 * (top-left) - the original component uses `top center`, which is only
 * correct when nothing else tries to reserve an exact box around the result.
 *
 * `dir="ltr"` on the wrapper is load-bearing, not decorative: this app is
 * Hebrew/RTL, and a block child wider than its container (the unscaled
 * content inside its scaled-footprint parent, before the transform shrinks
 * it visually) overflows toward the *inline-start* edge - the right, in
 * RTL - flush-right instead of flush-left. `top left` origin math assumes
 * the LTR case (flush-left, overflow right); under ambient RTL it anchors
 * the scaled paint to the wrong edge, which reads as the page being cut off.
 * The A4 page content inside can still set its own `dir="rtl"` - only this
 * geometry layer needs to be direction-agnostic.
 */

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

const A4_WIDTH_MM = 210
const MM_TO_PX = 96 / 25.4
const A4_WIDTH_PX = A4_WIDTH_MM * MM_TO_PX

export interface ScaleA4PreviewProps {
  children: ReactNode
  className?: string
}

export function ScaleA4Preview({ children, className }: ScaleA4PreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [contentHeight, setContentHeight] = useState(0)

  useLayoutEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (!container || !content) return

    const update = () => {
      const next = Math.min(container.clientWidth / A4_WIDTH_PX, 1)
      setScale(next > 0 ? next : 1)
      // Width comes from the known A4 constant, not `content.scrollWidth`:
      // this wrapper is `dir="ltr"` while the page content inside sets its
      // own `dir="rtl"`, and Chrome measures `scrollWidth` inconsistently
      // across that boundary (observed ~2x the real width). A wrong
      // reserved width breaks the `mx-auto` centering below - the box
      // can't center itself if it thinks it's wider than it is.
      setContentHeight(content.scrollHeight)
    }

    update()
    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(update)
    })
    resizeObserver.observe(container)
    resizeObserver.observe(content)
    return () => resizeObserver.disconnect()
  }, [])

  return (
    <div ref={containerRef} dir="ltr" className={cn('w-full', className)}>
      <div
        className="mx-auto"
        style={{ width: A4_WIDTH_PX * scale, height: contentHeight * scale || undefined }}
      >
        <div
          ref={contentRef}
          style={{ width: 'fit-content', transform: `scale(${scale})`, transformOrigin: 'top left' }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'

interface UseScrollSpyOptions {
  /** Selector for the elements to spy on; each must carry an id. */
  selector?: string
  /** Re-run observation whenever this string changes (e.g. locale switch). */
  watch?: string
  /** Distance below the scroll region's top edge at which a heading counts as "current". */
  offset?: number
}

/**
 * Highlights the section currently in view. The active heading is the last one
 * (in document order) whose top has crossed the threshold line inside the
 * scroll region, so it stays stable while scrolling deep into a long section.
 *
 * The live nodes are re-queried on every scroll instead of being captured once:
 * with React StrictMode the first effect run's captured nodes can end up
 * detached from the live tree (their rects read as 0), which would otherwise
 * corrupt the computation.
 */
export function useScrollSpy({
  selector = 'h2[id]',
  watch = '',
  offset = 140,
}: UseScrollSpyOptions = {}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // The scroll region is the nearest element that actually scrolls; the
    // container ref lives inside it (see DocPage's [data-doc-scroller]).
    const scroller =
      container.closest<HTMLElement>('[data-doc-scroller]') ?? document.scrollingElement

    const update = () => {
      const targets = [...container.querySelectorAll<HTMLElement>(selector)]
      if (targets.length === 0) return
      const isAtBottom = scroller
        ? scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < 4
        : false
      if (isAtBottom) {
        setActiveId(targets[targets.length - 1].id)
        return
      }
      const threshold = (scroller?.getBoundingClientRect().top ?? 0) + offset
      let current: string | null = null
      for (const target of targets) {
        if (target.getBoundingClientRect().top <= threshold) current = target.id
        else break
      }
      setActiveId(current)
    }

    update()
    scroller?.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      scroller?.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [selector, watch, offset])

  return { containerRef, activeId }
}

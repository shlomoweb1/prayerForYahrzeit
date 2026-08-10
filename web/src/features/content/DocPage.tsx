import type { ReactNode } from 'react'

/**
 * Layout shell for the pinned tech documents. The Wrapper pins the shell to
 * the viewport (header + footer always visible); this component owns the
 * scroll region so long documents scroll in place instead of stretching the
 * page (and the backdrop image) to full content height.
 */
export function DocPage({ children }: { children: ReactNode }) {
  return (
    <div data-doc-scroller className="h-full w-full overflow-y-auto overscroll-contain">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">{children}</div>
    </div>
  )
}

/**
 * P3-06 Word decoration: a big first-letter-above-word line.
 *
 * Per spike FINDINGS.md P2-04 the ONLY layout that survives Folio rendering
 * is flex columns inside a flex row (inline-block and absolute positioning
 * both break). The line is a flex row (wraps, centered); every word becomes
 * a flex column whose first grapheme cluster (letter + its nikud, via
 * splitFirstCluster) sits above the word body.
 *
 * The component is used for the sheet header, psalm headings and psalm
 * verses; it renders the exact same markup in the live preview and in the
 * captured PDF document.
 */

import type { CSSProperties, ReactNode } from 'react'

import { splitFirstCluster } from '@/lib/hebrew'

interface WordDecoLineProps {
  text: string
  /** Decoration scale relative to the line's font size. */
  decoScale: number
  className?: string
  style?: CSSProperties
}

export function WordDecoLine({ text, decoScale, className, style }: WordDecoLineProps) {
  const words = text.split(/\s+/).filter((word) => word.length > 0)
  if (words.length === 0) return null

  const columns: ReactNode[] = []
  for (const word of words) {
    if (columns.length > 0) columns.push(' ')
    const [first, rest] = splitFirstCluster(word)
    columns.push(
      <span className="izkor-dword" key={columns.length}>
        <span className="izkor-ddeco" style={{ fontSize: `${decoScale}em` }}>
          {first}
        </span>
        {rest}
      </span>,
    )
  }

  return (
    <div className={className} style={style}>
      <span className="izkor-dline">{columns}</span>
    </div>
  )
}

import type { ReactNode } from 'react'

export interface MarkdownHeading {
  id: string
  text: string
  level: number
}

/**
 * Stable URL/anchor id for a heading's text. Keeps Unicode letters (Hebrew,
 * Latin accents) so anchors work for every authored locale.
 */
export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/** Flattens react-markdown heading children (strings, nested elements) to text. */
export function toText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(toText).join('')
  if (typeof node === 'object' && 'props' in node) {
    return toText((node.props as { children?: ReactNode } | undefined)?.children)
  }
  return ''
}

/**
 * Collects h1-h3 headings from raw markdown for an "on this page" index.
 * Fenced code blocks are skipped so a # inside code never becomes an entry.
 */
export function extractHeadings(markdown: string): MarkdownHeading[] {
  const headings: MarkdownHeading[] = []
  let inFence = false
  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const match = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line)
    if (match) {
      const text = (match[2] ?? '').trim()
      headings.push({ id: slugify(text), text, level: (match[1] ?? '').length })
    }
  }
  return headings
}

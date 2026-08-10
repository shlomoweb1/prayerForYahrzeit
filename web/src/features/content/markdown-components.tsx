import type { Components } from 'react-markdown'

import { cn } from '@/lib/utils'

import { slugify, toText } from './markdown-utils'

export interface DocComponentOptions {
  /**
   * Compact vertical rhythm for short bodies (about bios); document mode
   * uses the fuller margins the long tech docs need.
   */
  compact?: boolean
}

/**
 * Single source of truth for how markdown renders across the app. Both the
 * about bios and the long tech documents (tools, folio) go through this map,
 * so headings, code, tables and spacing stay consistent. Headings get a
 * slugified id so they double as anchor targets. Logical properties
 * (ps/pe, border-s, text-start) keep the styling correct in RTL (Hebrew)
 * and LTR (English) locales.
 */
export function createDocComponents({ compact = false }: DocComponentOptions = {}): Components {
  const bodyText = compact
    ? 'text-base leading-relaxed text-muted-foreground'
    : 'my-3 text-[15px] leading-7 text-foreground/90'
  const listText = compact
    ? 'my-2 space-y-1.5 ps-5 text-base leading-relaxed text-muted-foreground marker:text-muted-foreground/60'
    : 'my-3 space-y-2 ps-6 text-[15px] leading-7 text-foreground/90 marker:text-gold/60'

  return {
    h1: ({ children }) => (
      <h1
        id={slugify(toText(children))}
        className="mb-4 mt-2 scroll-mt-24 font-display text-3xl font-bold text-gold lang-he:font-keter"
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        id={slugify(toText(children))}
        className={cn(
          'mb-3 mt-8 scroll-mt-24 font-display text-2xl font-semibold text-gold lang-he:font-keter',
          compact && 'mt-6',
        )}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        id={slugify(toText(children))}
        className={cn(
          'mb-2 mt-6 scroll-mt-24 font-display text-xl font-semibold text-gold lang-he:font-keter',
          compact && 'mt-5',
        )}
      >
        {children}
      </h3>
    ),
    p: ({ children }) => <p className={bodyText}>{children}</p>,
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    a: ({ children, href }) => (
      <a
        href={href}
        className="font-medium text-gold underline underline-offset-4 hover:text-gold/80"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    ul: ({ children }) => <ul className={listText}>{children}</ul>,
    ol: ({ children }) => <ol className={listText}>{children}</ol>,
    li: ({ children }) => <li className="ps-1">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote
        className={cn(
          'my-5 border-s-2 border-gold/50 ps-4 italic leading-7 text-muted-foreground',
          compact && 'my-4',
        )}
      >
        {children}
      </blockquote>
    ),
    hr: () => <hr className={cn('my-6 border-border/60', compact && 'my-5')} />,
    table: ({ children }) => (
      <div className="my-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-[15px]">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-secondary/60 text-foreground">{children}</thead>,
    tr: ({ children }) => <tr className="border-b border-border last:border-0">{children}</tr>,
    th: ({ children }) => <th className="px-3 py-2 text-start font-semibold">{children}</th>,
    td: ({ children }) => <td className="px-3 py-2 align-top text-muted-foreground">{children}</td>,
    pre: ({ children }) => (
      <pre className="my-4 overflow-x-auto rounded-lg border border-border bg-secondary/60 p-4 font-mono text-sm leading-relaxed text-foreground">
        {children}
      </pre>
    ),
    code: ({ className, children }) => {
      const content = String(children).replace(/\n$/, '')
      const isBlock = content.includes('\n') || /language-/.test(className ?? '')
      if (isBlock) {
        return <code className="font-mono">{content}</code>
      }
      return (
        <code className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
          {content}
        </code>
      )
    },
  }
}

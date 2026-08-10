import ReactMarkdown from 'react-markdown'
import { useTranslation } from 'react-i18next'
import remarkGfm from 'remark-gfm'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { cn } from '@/lib/utils'

import { createDocComponents } from './markdown-components'
import { extractHeadings } from './markdown-utils'
import { useScrollSpy } from './useScrollSpy'

interface DocRendererProps {
  content: string
  /**
   * Render a scrollspy "on this page" index. On desktop this is a reader-view
   * navigation fixed to the end side of the viewport while the content column
   * scrolls; on mobile it collapses into an accordion above the content.
   */
  withToc?: boolean
  /** Compact rhythm for short snippets (about bios). */
  compact?: boolean
}

/**
 * Shared markdown renderer. Handles the long tech documents and the about
 * bios, optionally adding a split-pane reader view: the content column is
 * spied on with an IntersectionObserver and the matching section is
 * highlighted in the fixed table of contents as the reader scrolls.
 */
export function DocRenderer({ content, withToc = false, compact = false }: DocRendererProps) {
  const { t } = useTranslation()
  const headings = withToc
    ? extractHeadings(content).filter((heading) => heading.level === 2)
    : []
  const tocKey = headings.map((heading) => heading.id).join('|')
  const { containerRef, activeId } = useScrollSpy({ selector: 'h2[id]', watch: tocKey })
  const hasToc = headings.length > 0

  const scrollTo = (id: string) => (event: { preventDefault: () => void }) => {
    event.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const tocList = (
    <ul className="grid gap-1">
      {headings.map((heading) => (
        <li key={heading.id}>
          <a
            href={`#${heading.id}`}
            aria-current={activeId === heading.id ? 'location' : undefined}
            onClick={scrollTo(heading.id)}
            className={cn(
              'block text-sm leading-6 transition-colors',
              activeId === heading.id
                ? 'font-medium text-gold underline'
                : 'no-underline text-muted-foreground hover:text-gold',
            )}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  )

  return (
    <div>
      {hasToc && (
        <Accordion
          type="single"
          collapsible
          className="mb-6 rounded-lg border border-border bg-card/70 px-4 backdrop-blur-sm lg:hidden"
        >
          <AccordionItem value="toc" className="border-b-0">
            <AccordionTrigger className="font-display text-sm font-semibold uppercase tracking-wide text-gold lang-he:font-keter">
              {t('common.tocTitle')}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{tocList}</AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      <div ref={containerRef} className={cn('min-w-0 bg-background/80 p-4 rounded-sm', hasToc && 'lg:pe-67.5')}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={createDocComponents({ compact })}>
          {content}
        </ReactMarkdown>
      </div>
      {hasToc && (
        <aside
          aria-label={t('common.tocTitle')}
          className="fixed top-24 z-10 hidden w-57.5 max-h-[calc(100dvh-10rem)] overflow-y-auto lg:block me-8"
          style={{ insetInlineEnd: 'max(1rem, calc((100vw - 72rem) / 2 + 1rem))' }}
        >
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-gold lang-he:font-keter">
            {t('common.tocTitle')}
          </p>
          <div className="mt-3">{tocList}</div>
        </aside>
      )}
    </div>
  )
}

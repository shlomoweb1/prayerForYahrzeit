import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  content: string
}

/**
 * Renders an author-bio markdown body with izkor's design language.
 * Logical properties (ps/pe, border-s, text-start) keep the styling
 * correct in both RTL (Hebrew) and LTR (English) locales.
 */
const components: Components = {
  h2: ({ children }) => (
    <h2 className="mt-8 font-display text-2xl font-semibold tracking-tight text-gold lang-he:font-keter">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-gold lang-he:font-keter">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="text-base leading-relaxed text-muted-foreground">{children}</p>,
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
  ul: ({ children }) => (
    <ul className="list-disc space-y-1.5 ps-5 text-base leading-relaxed text-muted-foreground marker:text-muted-foreground/60">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal space-y-1.5 ps-5 text-base leading-relaxed text-muted-foreground marker:text-muted-foreground/60">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="ps-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-s-2 border-gold/40 ps-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-base">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-secondary/60 text-foreground">{children}</thead>,
  tr: ({ children }) => <tr className="border-b border-border last:border-0">{children}</tr>,
  th: ({ children }) => <th className="px-3 py-2 text-start font-semibold">{children}</th>,
  td: ({ children }) => <td className="px-3 py-2 align-top text-muted-foreground">{children}</td>,
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-lg border border-border bg-secondary/60 p-4 font-mono text-sm leading-relaxed text-foreground">
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

export function AboutRenderer({ content }: Props) {
  return (
    <div className="flex max-w-2xl flex-col gap-y-4">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

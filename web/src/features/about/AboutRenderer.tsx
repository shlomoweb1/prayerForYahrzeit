import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { createDocComponents } from '@/features/content/markdown-components'

interface Props {
  content: string
}

/**
 * Renders an author-bio markdown body. Shares the app-wide markdown styling
 * (markdown-components) in its compact variant; the long tech documents use
 * the same map via DocRenderer.
 */
export function AboutRenderer({ content }: Props) {
  return (
    <div className="flex max-w-2xl flex-col">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={createDocComponents({ compact: true })}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

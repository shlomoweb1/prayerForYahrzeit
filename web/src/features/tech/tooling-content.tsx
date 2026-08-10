import { DocRenderer } from '@/features/content/DocRenderer'
import { useLocalizedContent } from '@/features/content/useLocalizedContent'

import toolingEn from '@/content/tech/tooling.en.md?raw'
import toolingHe from '@/content/tech/tooling.he.md?raw'
import toolingEs from '@/content/tech/tooling.es.md?raw'
import toolingFr from '@/content/tech/tooling.fr.md?raw'

/**
 * The "tools behind this site" document, in every supported locale —
 * all four (he/en/fr/es) have authored content; unknown locales fall back
 * to English, same convention as bio-versions.
 */
const CONTENT: Record<string, string> = {
  he: toolingHe,
  en: toolingEn,
  es: toolingEs,
  fr: toolingFr,
}

export function ToolingContent() {
  const content = useLocalizedContent(CONTENT, toolingEn)
  return <DocRenderer content={content} withToc />
}

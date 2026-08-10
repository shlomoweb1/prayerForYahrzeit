import { DocRenderer } from '@/features/content/DocRenderer'
import { useLocalizedContent } from '@/features/content/useLocalizedContent'

import folioEn from '@/content/tech/folio.en.md?raw'
import folioHe from '@/content/tech/folio.he.md?raw'

/**
 * The "how is a PDF created" document, in every authored locale.
 * Unknown locales fall back to English, same convention as bio-versions.
 */
const CONTENT: Record<string, string> = {
  he: folioHe,
  en: folioEn,
}

export function FolioContent() {
  const content = useLocalizedContent(CONTENT, folioEn)
  return <DocRenderer content={content} withToc />
}

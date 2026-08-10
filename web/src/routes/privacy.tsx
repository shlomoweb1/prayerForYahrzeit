import { createFileRoute } from '@tanstack/react-router'

import PrivacyPage from '@/pages/PrivacyPage'
import { buildHreflang } from '@/features/seo/hreflang'
import { buildWebPageSchema } from '@/features/seo/schemas'
import { siteUrl } from '@/lib/site'

const TITLE = 'מדיניות פרטיות — תפילה לנשמה'
const DESCRIPTION = 'מדיניות הפרטיות של תפילה לנשמה - אילו נתונים נשמרים, איפה, ומדוע.'

export const Route = createFileRoute('/privacy')({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:url', content: siteUrl('/privacy') },
      {
        'script:ld+json': buildWebPageSchema('מדיניות פרטיות', siteUrl('/privacy'), DESCRIPTION),
      },
    ],
    links: [
      { rel: 'canonical', href: siteUrl('/privacy') },
      ...buildHreflang('/privacy'),
    ],
  }),
  component: PrivacyPage,
})

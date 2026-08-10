import { createFileRoute } from '@tanstack/react-router'

import AccessibilityPage from '@/pages/AccessibilityPage'
import { buildHreflang } from '@/features/seo/hreflang'
import { buildWebPageSchema } from '@/features/seo/schemas'
import { siteUrl } from '@/lib/site'

const TITLE = 'Accessibility Statement — Prayer for the Soul'
const DESCRIPTION =
  'The Prayer for the Soul accessibility statement — conformance, accessibility features, known limitations and how to reach us.'

export const Route = createFileRoute('/en/accessibility')({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:url', content: siteUrl('/en/accessibility') },
      {
        'script:ld+json': buildWebPageSchema('Accessibility Statement', siteUrl('/en/accessibility'), DESCRIPTION),
      },
    ],
    links: [
      { rel: 'canonical', href: siteUrl('/en/accessibility') },
      ...buildHreflang('/accessibility'),
    ],
  }),
  component: AccessibilityPage,
})

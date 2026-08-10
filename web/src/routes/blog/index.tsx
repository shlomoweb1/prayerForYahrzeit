import { createFileRoute } from '@tanstack/react-router'

import BlogIndexPage from '@/pages/BlogIndexPage'
import { buildHreflang } from '@/features/seo/hreflang'
import { buildBreadcrumbs } from '@/features/seo/schemas'
import { siteUrl } from '@/lib/site'

const TITLE = 'בלוג — תפילה לנשמה'
const DESCRIPTION = 'פרקים מהסדנה - איך האתר הזה נבנה.'

export const Route = createFileRoute('/blog/')({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:url', content: siteUrl('/blog') },
      {
        'script:ld+json': buildBreadcrumbs([
          { name: 'תפילה לנשמה', url: siteUrl('/') },
          { name: 'בלוג', url: siteUrl('/blog') },
        ]),
      },
    ],
    links: [
      { rel: 'canonical', href: siteUrl('/blog') },
      ...buildHreflang('/blog'),
    ],
  }),
  component: BlogIndexPage,
})

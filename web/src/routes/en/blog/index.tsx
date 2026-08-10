import { createFileRoute } from '@tanstack/react-router'

import BlogIndexPage from '@/pages/BlogIndexPage'
import { buildHreflang } from '@/features/seo/hreflang'
import { buildBreadcrumbs } from '@/features/seo/schemas'
import { siteUrl } from '@/lib/site'

const TITLE = 'Blog — Prayer for the Soul'
const DESCRIPTION = 'Notes from the workshop - how this site is built.'

export const Route = createFileRoute('/en/blog/')({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:url', content: siteUrl('/en/blog') },
      {
        'script:ld+json': buildBreadcrumbs([
          { name: 'Prayer for the Soul', url: siteUrl('/en') },
          { name: 'Blog', url: siteUrl('/en/blog') },
        ]),
      },
    ],
    links: [
      { rel: 'canonical', href: siteUrl('/en/blog') },
      ...buildHreflang('/blog'),
    ],
  }),
  component: BlogIndexPage,
})

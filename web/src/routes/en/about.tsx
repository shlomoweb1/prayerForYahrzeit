import { createFileRoute } from '@tanstack/react-router'

import AboutPage from '@/pages/AboutPage'
import { buildHreflang } from '@/features/seo/hreflang'
import { buildPersonSchema } from '@/features/seo/schemas'
import { siteUrl } from '@/lib/site'

const TITLE = 'About — Prayer for the Soul'
const DESCRIPTION =
  'The person behind Prayer for the Soul — Shlomo, a builder of servers, websites and applications.'

export const Route = createFileRoute('/en/about')({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:url', content: siteUrl('/en/about') },
      { 'script:ld+json': buildPersonSchema('Shlomo', siteUrl('/en/about')) },
    ],
    links: [
      { rel: 'canonical', href: siteUrl('/en/about') },
      ...buildHreflang('/about'),
    ],
  }),
  component: AboutPage,
})

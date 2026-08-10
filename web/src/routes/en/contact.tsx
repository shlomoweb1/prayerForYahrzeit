import { createFileRoute } from '@tanstack/react-router'

import ContactPage from '@/pages/ContactPage'
import { buildHreflang } from '@/features/seo/hreflang'
import { buildContactPageSchema } from '@/features/seo/schemas'
import { siteUrl } from '@/lib/site'

const TITLE = 'Contact — Prayer for the Soul'
const DESCRIPTION =
  'Looking for someone to build a system, website or project? Write a few lines and I will get back to you.'

export const Route = createFileRoute('/en/contact')({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:url', content: siteUrl('/en/contact') },
      {
        'script:ld+json': buildContactPageSchema('Contact', siteUrl('/en/contact'), DESCRIPTION),
      },
    ],
    links: [
      { rel: 'canonical', href: siteUrl('/en/contact') },
      ...buildHreflang('/contact'),
    ],
  }),
  component: ContactPage,
})

import { createFileRoute } from '@tanstack/react-router'

import ContactPage from '@/pages/ContactPage'
import { buildHreflang } from '@/features/seo/hreflang'
import { buildContactPageSchema } from '@/features/seo/schemas'
import { siteUrl } from '@/lib/site'

const TITLE = 'יצירת קשר — תפילה לנשמה'
const DESCRIPTION = 'מחפשים בונה למערכת, אתר או פרויקט? כתבו כמה שורות ואחזור אליכם.'

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:url', content: siteUrl('/contact') },
      {
        'script:ld+json': buildContactPageSchema('יצירת קשר', siteUrl('/contact'), DESCRIPTION),
      },
    ],
    links: [
      { rel: 'canonical', href: siteUrl('/contact') },
      ...buildHreflang('/contact'),
    ],
  }),
  component: ContactPage,
})

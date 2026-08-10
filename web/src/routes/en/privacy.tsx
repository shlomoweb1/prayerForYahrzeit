import { createFileRoute } from '@tanstack/react-router'

import PrivacyPage from '@/pages/PrivacyPage'
import { buildHreflang } from '@/features/seo/hreflang'
import { buildWebPageSchema } from '@/features/seo/schemas'
import { siteUrl } from '@/lib/site'

const TITLE = 'Privacy Policy — Prayer for the Soul'
const DESCRIPTION = 'The privacy policy of Prayer for the Soul - what data is kept, where, and why.'

export const Route = createFileRoute('/en/privacy')({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:url', content: siteUrl('/en/privacy') },
      {
        'script:ld+json': buildWebPageSchema('Privacy Policy', siteUrl('/en/privacy'), DESCRIPTION),
      },
    ],
    links: [
      { rel: 'canonical', href: siteUrl('/en/privacy') },
      ...buildHreflang('/privacy'),
    ],
  }),
  component: PrivacyPage,
})

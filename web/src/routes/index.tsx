import { createFileRoute } from '@tanstack/react-router'

import LandingPage from '@/pages/LandingPage'
import { buildHreflang } from '@/features/seo/hreflang'
import { buildOrganizationSchema, buildWebSiteSchema, ogImageUrl } from '@/features/seo/schemas'
import { siteUrl } from '@/lib/site'

const SITE_NAME = 'תפילה לנשמה'
const DESCRIPTION =
  'בניית דף תפילה מהודר להדפסה — תהילים, קדיש, משניות והשכבה — לקריאה בבית העלמין ולשיתוף עם המשפחה'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'תפילה לנשמה — דף תפילה לקריאה בבית העלמין' },
      { name: 'description', content: DESCRIPTION },
      { property: 'og:title', content: 'תפילה לנשמה — דף תפילה לקריאה בבית העלמין' },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:url', content: siteUrl('/') },
      { 'script:ld+json': buildWebSiteSchema(SITE_NAME, DESCRIPTION, siteUrl('/')) },
      { 'script:ld+json': buildOrganizationSchema(SITE_NAME, siteUrl('/'), ogImageUrl()) },
    ],
    links: [
      { rel: 'canonical', href: siteUrl('/') },
      ...buildHreflang('/'),
    ],
  }),
  component: LandingPage,
})

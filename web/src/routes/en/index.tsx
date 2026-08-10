import { createFileRoute } from '@tanstack/react-router'

import LandingPage from '@/pages/LandingPage'
import { buildHreflang } from '@/features/seo/hreflang'
import { buildOrganizationSchema, buildWebSiteSchema, ogImageUrl } from '@/features/seo/schemas'
import { siteUrl } from '@/lib/site'

const SITE_NAME = 'Prayer for the Soul'
const DESCRIPTION =
  'Build an elegant printable memorial prayer sheet — Tehillim, Kaddish, Mishnayot and Yizkor — for reading at the cemetery and sharing with family'

export const Route = createFileRoute('/en/')({
  head: () => ({
    meta: [
      { title: 'Prayer for the Soul — printable memorial prayer sheet' },
      { name: 'description', content: DESCRIPTION },
      { property: 'og:title', content: 'Prayer for the Soul — printable memorial prayer sheet' },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:url', content: siteUrl('/en') },
      { 'script:ld+json': buildWebSiteSchema(SITE_NAME, DESCRIPTION, siteUrl('/en')) },
      { 'script:ld+json': buildOrganizationSchema(SITE_NAME, siteUrl('/en'), ogImageUrl()) },
    ],
    links: [
      { rel: 'canonical', href: siteUrl('/en') },
      ...buildHreflang('/'),
    ],
  }),
  component: LandingPage,
})

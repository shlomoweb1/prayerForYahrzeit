import { siteUrl } from '@/lib/site'
import { ogImageUrl } from './schemas'

const SITE_NAME = 'תפילה לנשמה'
const DEFAULT_TITLE = 'תפילה לנשמה - דף תפילה לקריאה בבית העלמין'
const DEFAULT_DESCRIPTION =
  'בניית דף תפילה מהודר להדפסה - תהילים, קדיש, משניות והשכבה - לקריאה בבית העלמין ולשיתוף עם המשפחה'

/**
 * Site-wide fallback head, attached to the root route. Nested routes override
 * title/description/canonical/og via their own head(); these tags cover any
 * route that does not, and carry the shared OG image and social card.
 */
export function siteDefaults() {
  return {
    meta: [
      { title: DEFAULT_TITLE },
      { name: 'description', content: DEFAULT_DESCRIPTION },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: ogImageUrl() },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: ogImageUrl() },
    ],
    links: [{ rel: 'canonical', href: siteUrl('/') }],
  }
}

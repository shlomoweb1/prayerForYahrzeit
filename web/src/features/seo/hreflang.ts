import { siteUrl } from '@/lib/site'

/**
 * hreflang alternate set for a logical (bare, unprefixed) path. The Hebrew
 * URL is canonical on the bare form, English on /en, and x-default points at
 * the Hebrew page (the site's primary audience). es/fr readers share the
 * English URL, so no extra alternates are emitted for them.
 */
export function buildHreflang(
  path: string,
): Array<{ rel: 'alternate'; hrefLang: string; href: string }> {
  const bare = path === '/' ? '/' : path
  const enPath = path === '/' ? '/en' : `/en${path}`
  return [
    { rel: 'alternate', hrefLang: 'he', href: siteUrl(bare) },
    { rel: 'alternate', hrefLang: 'en', href: siteUrl(enPath) },
    { rel: 'alternate', hrefLang: 'x-default', href: siteUrl(bare) },
  ]
}

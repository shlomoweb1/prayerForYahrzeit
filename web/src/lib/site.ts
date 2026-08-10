/**
 * Canonical origin for the site, from VITE_SITE_URL (set in web/.env). All
 * absolute URLs - canonical, hreflang, JSON-LD, OG image - derive from this.
 * TODO(prod): the fallback domain below is a placeholder; set VITE_SITE_URL
 * to the real production origin before launch.
 */
export const SITE_URL: string =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.trim() || 'https://izkor.example'

/** Joins the site origin with a path. `siteUrl('/about')` → `https://…/about`. */
export function siteUrl(path: string): string {
  if (!path || path === '/') return `${SITE_URL}/`
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

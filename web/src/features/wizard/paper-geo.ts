/**
 * Best-effort default paper size from the visitor's IP-derived country —
 * not their UI locale, which says nothing about where they're printing
 * from (a Hebrew-reading user in the US still needs Letter, not A4).
 *
 * ISO 216 (A4) is the paper standard almost everywhere; the short list
 * below is the practical set of countries where Letter/similar cut sizes
 * are the default. A4 is the safe fallback on any lookup failure, timeout,
 * or unrecognized country — it's correct for the overwhelming majority of
 * the world, so failing closed to it never surprises most visitors.
 */

import type { SheetPaper } from '@/features/sheet/layout'

const LETTER_COUNTRIES = new Set([
  'US',
  'CA',
  'MX',
  'PH',
  'CL',
  'CO',
  'CR',
  'GT',
  'PA',
  'DO',
  'SV',
  'HN',
  'NI',
  'PR',
])

interface GeoCountryResponse {
  country_code?: string
}

/**
 * No API key, CORS-enabled IP→country lookup. Aborts (and falls back to
 * A4) if the network is slow, so this never delays the wizard.
 */
export async function detectPaperFromIp(timeoutMs = 2500): Promise<SheetPaper> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch('https://get.geojs.io/v1/ip/country.json', {
      signal: controller.signal,
    })
    if (!response.ok) return 'a4'
    const data = (await response.json()) as GeoCountryResponse
    const code = data.country_code?.toUpperCase()
    return code && LETTER_COUNTRIES.has(code) ? 'letter' : 'a4'
  } catch {
    return 'a4'
  } finally {
    window.clearTimeout(timeout)
  }
}

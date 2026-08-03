/**
 * Font embedder: rewrite @font-face url(/fonts/…) sources to data URIs.
 *
 * The Folio worker has no URL resolution beyond the captured document, so
 * every font the sheet uses must be inlined. Fetch results are cached for the
 * session (Map) — each font is fetched once per app lifetime.
 */

const fontCache = new Map<string, string>()
const fontUrlRe = /url\(["']?([^"')]+)["']?\)/g

function mimeFor(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase()
  if (ext === 'woff2') return 'font/woff2'
  if (ext === 'woff') return 'font/woff'
  if (ext === 'otf') return 'font/otf'
  return 'font/truetype'
}

async function fontToDataUri(url: string): Promise<string> {
  const cached = fontCache.get(url)
  if (cached) return cached
  const resp = await fetch(url)
  if (!resp.ok) throw new Error(`font fetch failed: ${url} (${resp.status})`)
  const bytes = new Uint8Array(await resp.arrayBuffer())
  let binary = ''
  const CHUNK = 0x8000
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
  }
  const dataUri = `data:${mimeFor(url)};base64,${btoa(binary)}`
  fontCache.set(url, dataUri)
  return dataUri
}

/** Replace every non-data font URL in the HTML with its cached data URI. */
export async function inlineFontFaces(html: string): Promise<string> {
  if (!html.includes('@font-face')) return html
  const urls = new Set<string>()
  for (const match of html.matchAll(fontUrlRe)) {
    const url = match[1]!
    if (url.startsWith('data:')) continue
    urls.add(url)
  }
  if (urls.size === 0) return html

  const byUrl = new Map<string, string>()
  for (const url of urls) {
    byUrl.set(url, await fontToDataUri(url))
  }
  return html.replace(fontUrlRe, (full, url: string) => {
    if (!url.startsWith('data:') && byUrl.has(url)) return `url("${byUrl.get(url)}")`
    return full
  })
}

/** For tests: reset the session cache. */
export function clearFontCache(): void {
  fontCache.clear()
}

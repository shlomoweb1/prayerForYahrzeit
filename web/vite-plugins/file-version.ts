/**
 * Cache-busting version for a static file under public/, derived from its
 * content (sha256, not mtime — a rewrite that doesn't change the bytes, e.g.
 * git checkout or an unrelated re-copy, must not bump the version). Files
 * under public/ are copied verbatim (no content hash), so a URL that doesn't
 * include this stays cached indefinitely in both the browser's HTTP cache
 * and the PWA service worker whenever the file is edited under the same
 * name. Append `?v=${fileVersion(...)}` to any URL pointing at such a file
 * so an edit is always a new URL, everywhere, with no manual cache-clear
 * instructions needed.
 */
import { createHash } from 'node:crypto'
import fs from 'node:fs'

export function fileVersion(absPath: string): string {
  return createHash('sha256').update(fs.readFileSync(absPath)).digest('hex').slice(0, 10)
}

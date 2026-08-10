/**
 * Serializes a JSON-LD object for injection into a <script type="application/ld+json">.
 * Escapes `<` so a `</script>` sequence inside user- or CMS-provided data cannot
 * break out of the script tag (XSS). Always use this over bare JSON.stringify.
 */
export function escapeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

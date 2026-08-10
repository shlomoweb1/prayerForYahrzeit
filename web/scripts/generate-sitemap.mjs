import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

function loadSiteUrl() {
  if (process.env.VITE_SITE_URL?.trim()) return process.env.VITE_SITE_URL.trim()
  try {
    const envFile = readFileSync(join(ROOT, '.env'), 'utf-8')
    const match = envFile.match(/^VITE_SITE_URL=(.*)$/m)
    if (match?.[1]?.trim()) return match[1].trim()
  } catch {
    // no .env file - fall through to the placeholder
  }
  return 'https://izkor.example'
}

const SITE_URL = loadSiteUrl().replace(/\/$/, '')

// Kept in sync with src/features/blog/posts-meta.ts by hand - see that
// file's comment for why post metadata is duplicated rather than imported
// (this is a plain Node script, outside Vite's module graph and aliases).
const BLOG_POSTS = [
  { slug: 'pdf-in-the-browser', lastmod: '2026-08-10' },
  { slug: 'tools-behind-this-site', lastmod: '2026-08-10' },
]

const BUILD_DATE = new Date().toISOString().slice(0, 10)

// Bare (Hebrew) paths. Every one also gets an /en sibling below.
const PATHS = [
  { path: '/', lastmod: BUILD_DATE },
  { path: '/about', lastmod: BUILD_DATE },
  { path: '/accessibility', lastmod: BUILD_DATE },
  { path: '/blog', lastmod: BUILD_DATE },
  { path: '/contact', lastmod: BUILD_DATE },
  { path: '/privacy', lastmod: BUILD_DATE },
  ...BLOG_POSTS.map((post) => ({ path: `/blog/${post.slug}`, lastmod: post.lastmod })),
]

function enPath(path) {
  return path === '/' ? '/en' : `/en${path}`
}

function urlTag(path, lastmod) {
  const loc = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
}

const entries = PATHS.flatMap(({ path, lastmod }) => [
  urlTag(path, lastmod),
  urlTag(enPath(path), lastmod),
])

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`

writeFileSync(join(ROOT, 'public', 'sitemap.xml'), xml)
console.log(`Wrote sitemap.xml with ${entries.length} URLs (${SITE_URL})`)

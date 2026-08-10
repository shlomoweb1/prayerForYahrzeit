import { load as parseYaml } from 'js-yaml'

import pdfEnRaw from '@/content/blog/pdf-in-the-browser.en.md?raw'
import pdfHeRaw from '@/content/blog/pdf-in-the-browser.he.md?raw'
import toolsEnRaw from '@/content/blog/tools-behind-this-site.en.md?raw'
import toolsHeRaw from '@/content/blog/tools-behind-this-site.he.md?raw'

export interface PostMeta {
  title: string
  /** ISO date (yyyy-mm-dd), used for the dateline. */
  date: string
  /** One-line summary, shown on the index. */
  excerpt: string
}

export interface BlogPost {
  slug: string
  /** Frontmatter metadata per authored locale; English is the fallback. */
  metaByLocale: Record<string, PostMeta>
  /** Markdown body (frontmatter stripped) per authored locale. */
  contentByLocale: Record<string, string>
}

interface ParsedPost {
  meta: PostMeta
  content: string
}

const FRONT_MATTER_OPEN = '---\n'
const FRONT_MATTER_CLOSE = '\n---'

/**
 * Splits a markdown string on `---` YAML front-matter delimiters and parses
 * the block with js-yaml — the same YAML engine gray-matter delegates to,
 * without gray-matter's Node-only `Buffer` dependency (unavailable in the
 * browser). Unquoted `date: 2026-08-10` is parsed as a Date by YAML, so quote
 * dates in the file; values are coerced to strings defensively here.
 */
function parseFrontMatter(raw: string): { data: Record<string, unknown>; content: string } {
  if (!raw.startsWith(FRONT_MATTER_OPEN)) {
    return { data: {}, content: raw }
  }
  const bodyEnd = raw.indexOf(FRONT_MATTER_CLOSE, FRONT_MATTER_OPEN.length)
  if (bodyEnd === -1) {
    return { data: {}, content: raw }
  }
  const data = (parseYaml(raw.slice(FRONT_MATTER_OPEN.length, bodyEnd)) ?? {}) as Record<string, unknown>
  let content = raw.slice(bodyEnd + FRONT_MATTER_CLOSE.length)
  if (content.startsWith('\r')) content = content.slice(1)
  if (content.startsWith('\n')) content = content.slice(1)
  return { data, content }
}

/**
 * Reads a post file's YAML frontmatter (title, date, excerpt — edited directly
 * in the markdown) and returns the body without it.
 */
function parsePost(raw: string): ParsedPost {
  const { data, content } = parseFrontMatter(raw)
  return {
    meta: {
      title: String(data.title ?? ''),
      date: String(data.date ?? ''),
      excerpt: String(data.excerpt ?? ''),
    },
    content,
  }
}

const pdfEn = parsePost(pdfEnRaw)
const pdfHe = parsePost(pdfHeRaw)
const toolsEn = parsePost(toolsEnRaw)
const toolsHe = parsePost(toolsHeRaw)

export const BLOG_POSTS: readonly BlogPost[] = [
  {
    slug: 'pdf-in-the-browser',
    metaByLocale: { en: pdfEn.meta, he: pdfHe.meta },
    contentByLocale: { en: pdfEn.content, he: pdfHe.content },
  },
  {
    slug: 'tools-behind-this-site',
    metaByLocale: { en: toolsEn.meta, he: toolsHe.meta },
    contentByLocale: { en: toolsEn.content, he: toolsHe.content },
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}

/** The post's authoritative (fallback, English) dateline, for sorting. */
export function getPostDate(post: BlogPost): string {
  return post.metaByLocale.en?.date ?? ''
}

/** Localized dateline for a post's ISO date, e.g. "August 10, 2026". */
export function formatPostDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso))
}

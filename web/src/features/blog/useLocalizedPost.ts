import { useRouteLocale } from '@/features/i18n/route-locale'

import { useLocalizedContent } from '@/features/content/useLocalizedContent'

import type { BlogPost, PostMeta } from './posts'

export const FALLBACK_META: PostMeta = { title: '', date: '', excerpt: '' }

/**
 * Resolves a post's title, body, dateline and excerpt for the URL's locale
 * form. Hebrew URLs get the authored Hebrew content and frontmatter; English
 * URLs (and anything sharing them) fall back to English - identical
 * convention to useLocalizedContent.
 */
export function useLocalizedPost(post: BlogPost) {
  const locale = useRouteLocale()
  const content = useLocalizedContent(post.contentByLocale, post.contentByLocale.en ?? '')
  const meta = post.metaByLocale[locale] ?? post.metaByLocale.en ?? FALLBACK_META
  return { title: meta.title, excerpt: meta.excerpt, date: meta.date, content }
}

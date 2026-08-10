import { useTranslation } from 'react-i18next'

import { useLocalizedContent } from '@/features/content/useLocalizedContent'

import type { BlogPost, PostMeta } from './posts'

export const FALLBACK_META: PostMeta = { title: '', date: '', excerpt: '' }

/**
 * Resolves a post's title, body, dateline and excerpt for the active locale.
 * Hebrew readers get the authored Hebrew content and frontmatter; everyone
 * else (including es/fr) falls back to English - identical convention to
 * useLocalizedContent.
 */
export function useLocalizedPost(post: BlogPost) {
  const { i18n } = useTranslation()
  const content = useLocalizedContent(post.contentByLocale, post.contentByLocale.en ?? '')
  const meta = post.metaByLocale[i18n.language] ?? post.metaByLocale.en ?? FALLBACK_META
  return { title: meta.title, excerpt: meta.excerpt, date: meta.date, content }
}

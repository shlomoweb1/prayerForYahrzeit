import { createFileRoute } from '@tanstack/react-router'

import BlogPostPage from '@/pages/BlogPostPage'
import { FALLBACK_META, getPostMetaBySlug } from '@/features/blog/posts-meta'
import { buildHreflang } from '@/features/seo/hreflang'
import { buildArticleSchema, buildBreadcrumbs, ogImageUrl } from '@/features/seo/schemas'
import { siteUrl } from '@/lib/site'

const SITE_NAME = 'תפילה לנשמה'
const AUTHOR_NAME = 'שלמה'

export const Route = createFileRoute('/blog/$slug')({
  head: ({ params }) => {
    const post = getPostMetaBySlug(params.slug)
    if (!post) {
      return { meta: [{ name: 'robots', content: 'noindex, nofollow' }] }
    }
    const meta = post.metaByLocale.he ?? post.metaByLocale.en ?? FALLBACK_META
    const url = siteUrl(`/blog/${post.slug}`)
    const title = `${meta.title} — ${SITE_NAME}`

    return {
      meta: [
        { title },
        { name: 'description', content: meta.excerpt },
        { property: 'og:title', content: meta.title },
        { property: 'og:description', content: meta.excerpt },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: url },
        {
          'script:ld+json': buildArticleSchema({
            headline: meta.title,
            description: meta.excerpt,
            datePublished: meta.date,
            dateModified: meta.date,
            authorName: AUTHOR_NAME,
            authorUrl: siteUrl('/about'),
            url,
            publisherName: SITE_NAME,
            publisherLogoUrl: ogImageUrl(),
          }),
        },
        {
          'script:ld+json': buildBreadcrumbs([
            { name: SITE_NAME, url: siteUrl('/') },
            { name: 'בלוג', url: siteUrl('/blog') },
            { name: meta.title, url },
          ]),
        },
      ],
      links: [{ rel: 'canonical', href: url }, ...buildHreflang(`/blog/${post.slug}`)],
    }
  },
  component: BlogPostPage,
})

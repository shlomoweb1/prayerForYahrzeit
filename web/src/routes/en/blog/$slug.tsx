import { createFileRoute } from '@tanstack/react-router'

import BlogPostPage from '@/pages/BlogPostPage'
import { FALLBACK_META, getPostMetaBySlug } from '@/features/blog/posts-meta'
import { buildHreflang } from '@/features/seo/hreflang'
import { buildArticleSchema, buildBreadcrumbs, ogImageUrl } from '@/features/seo/schemas'
import { siteUrl } from '@/lib/site'

const SITE_NAME = 'Prayer for the Soul'
const AUTHOR_NAME = 'Shlomo'

export const Route = createFileRoute('/en/blog/$slug')({
  head: ({ params }) => {
    const post = getPostMetaBySlug(params.slug)
    if (!post) {
      return { meta: [{ name: 'robots', content: 'noindex, nofollow' }] }
    }
    const meta = post.metaByLocale.en ?? post.metaByLocale.he ?? FALLBACK_META
    const url = siteUrl(`/en/blog/${post.slug}`)
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
            authorUrl: siteUrl('/en/about'),
            url,
            publisherName: SITE_NAME,
            publisherLogoUrl: ogImageUrl(),
          }),
        },
        {
          'script:ld+json': buildBreadcrumbs([
            { name: SITE_NAME, url: siteUrl('/en') },
            { name: 'Blog', url: siteUrl('/en/blog') },
            { name: meta.title, url },
          ]),
        },
      ],
      links: [{ rel: 'canonical', href: url }, ...buildHreflang(`/blog/${post.slug}`)],
    }
  },
  component: BlogPostPage,
})

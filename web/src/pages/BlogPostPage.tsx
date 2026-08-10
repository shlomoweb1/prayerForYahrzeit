import { useParams } from '@tanstack/react-router'

import { BlogPostContent } from '@/features/blog/BlogPostContent'
import { getPostBySlug } from '@/features/blog/posts'
import { DocPage } from '@/features/content/DocPage'
import { NotFoundComponent } from '@/pages/NotFoundPage'

/**
 * Renders a single post for whatever locale form it is mounted under
 * (/blog/$slug or /en/blog/$slug) - the slug comes from the matched params
 * generically, and the content locale from the URL form. The document title
 * is set by the route's head(), not here.
 */
export default function BlogPostPage() {
  const { slug = '' } = useParams({ strict: false })
  const post = getPostBySlug(slug)

  if (!post) return <NotFoundComponent />

  return (
    <DocPage>
      <BlogPostContent post={post} />
    </DocPage>
  )
}

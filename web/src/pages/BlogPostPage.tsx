import { useParams } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { BlogPostContent } from '@/features/blog/BlogPostContent'
import { getPostBySlug, type BlogPost } from '@/features/blog/posts'
import { useLocalizedPost } from '@/features/blog/useLocalizedPost'
import { DocPage } from '@/features/content/DocPage'
import { NotFoundComponent } from '@/pages/NotFoundPage'

const EMPTY_POST: BlogPost = {
  slug: '',
  metaByLocale: {},
  contentByLocale: { en: '' },
}

export default function BlogPostPage() {
  const { t } = useTranslation()
  const { slug } = useParams({ from: '/blog/$slug' })
  const post = getPostBySlug(slug)
  const { title } = useLocalizedPost(post ?? EMPTY_POST)

  useEffect(() => {
    if (title) document.title = `${title} · ${t('common.brand')}`
  }, [title, t])

  if (!post) return <NotFoundComponent />

  return (
    <DocPage>
      <BlogPostContent post={post} />
    </DocPage>
  )
}

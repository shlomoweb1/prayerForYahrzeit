import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { OrnamentDivider } from '@/components/theme/ornaments'

import { BLOG_POSTS, formatPostDate, getPostDate, type BlogPost } from './posts'
import { useLocalizedPost } from './useLocalizedPost'

/**
 * The blog's front page: a small editorial masthead over a dated list of
 * posts. Kept deliberately light - one ornament, one column, no cards - so
 * it reads like a journal rather than a dashboard. The date is localized via
 * Intl (Hebrew shows a Hebrew dateline, LTR locales their own).
 */
export function BlogIndex() {
  const { t, i18n } = useTranslation()
  const posts = [...BLOG_POSTS].sort((a, b) => getPostDate(b).localeCompare(getPostDate(a)))

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 rounded-sm bg-background/80 px-6 py-10 sm:px-10 sm:py-14">
      <header className="text-center">
        <h1 className="font-display text-3xl font-bold text-gold lang-he:font-keter sm:text-4xl">
          {t('blog.title')}
        </h1>
        <p className="mt-3 text-muted-foreground">{t('blog.tagline')}</p>
        <OrnamentDivider className="mt-6" />
      </header>

      <ul className="grid gap-12">
        {posts.map((post) => (
          <BlogPostListItem key={post.slug} post={post} locale={i18n.language} />
        ))}
      </ul>
    </div>
  )
}

function BlogPostListItem({ post, locale }: { post: BlogPost; locale: string }) {
  const { title, excerpt, date } = useLocalizedPost(post)
  return (
    <li>
      <article>
        <time dateTime={date} className="text-sm text-muted-foreground">
          {formatPostDate(date, locale)}
        </time>
        <h2 className="mt-1.5 font-display text-2xl font-semibold lang-he:font-keter">
          <Link
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="no-underline transition-colors hover:text-gold"
          >
            {title}
          </Link>
        </h2>
        <p className="mt-2.5 leading-7 text-muted-foreground">{excerpt}</p>
      </article>
    </li>
  )
}

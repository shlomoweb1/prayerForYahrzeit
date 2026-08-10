import { useTranslation } from 'react-i18next'

import { DocRenderer } from '@/features/content/DocRenderer'

import { formatPostDate, type BlogPost } from './posts'
import { useLocalizedPost } from './useLocalizedPost'

/**
 * A post's reading pane: the frontmatter title and localized dateline rendered
 * as a header inside DocRenderer's readable background, with the markdown body
 * (and the "on this page" toc) below.
 */
export function BlogPostContent({ post }: { post: BlogPost }) {
  const { i18n } = useTranslation()
  const { title, excerpt, date, content } = useLocalizedPost(post)

  return (
    <DocRenderer
      content={content}
      withToc
      header={
        <header className="mb-6 text-center">
          <h1 className="font-display text-3xl font-bold text-gold lang-he:font-keter sm:text-4xl">
            {title}
          </h1>
          <time dateTime={date} className="mt-3 block text-sm text-muted-foreground">
            {formatPostDate(date, i18n.language)}
          </time>
          {excerpt ? (
            <p className="mx-auto mt-4 max-w-prose leading-7 text-muted-foreground">{excerpt}</p>
          ) : null}
        </header>
      }
    />
  )
}

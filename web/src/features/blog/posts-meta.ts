export interface PostMeta {
  title: string
  /** ISO date (yyyy-mm-dd), used for the dateline. */
  excerpt: string
  date: string
}

export interface PostMetaEntry {
  slug: string
  /** Frontmatter metadata per authored locale; English is the fallback. */
  metaByLocale: Record<string, PostMeta>
}

/**
 * Hardcoded copy of each post's frontmatter (title/date/excerpt), kept in
 * sync with `src/content/blog/*.md` by hand. This duplicates `posts.ts`'
 * parsed frontmatter on purpose: route `head()` functions run eagerly as
 * part of the route module, and `posts.ts` eagerly imports every post's full
 * markdown body via `?raw` for the page components - importing it from
 * head() would pull all post bodies into the eager route chunk and defeat
 * `autoCodeSplitting`. This file stays tiny and import-safe for that reason.
 */
export const POSTS_META: readonly PostMetaEntry[] = [
  {
    slug: 'pdf-in-the-browser',
    metaByLocale: {
      en: {
        title: 'How Can a PDF Be Created Directly in the Browser?',
        date: '2026-08-10',
        excerpt:
          'Every memorial sheet becomes a PDF - but the interesting part is how. No server, no screenshots: a real layout engine compiled to WebAssembly rebuilds the document right in your browser, Hebrew vowels and all.',
      },
      he: {
        title: 'איך אפשר ליצור PDF ישירות בדפדפן?',
        date: '2026-08-10',
        excerpt:
          'כל דף זיכרון הופך ל-PDF - אבל החלק המעניין הוא איך. בלי שרת, בלי צילום מסך: מנוע פריסה אמיתי, מורכב ל-WebAssembly, בונה את המסמך מחדש ישירות בדפדפן - כולל העברית עם הניקוד.',
      },
    },
  },
  {
    slug: 'tools-behind-this-site',
    metaByLocale: {
      en: {
        title: 'The Tools Behind This Website - Explained Simply',
        date: '2026-08-10',
        excerpt:
          'What quietly powers this site - the open-source stack, the Hebrew fonts, and the choice to do all the work in your browser so your sheet never leaves your device.',
      },
      he: {
        title: 'הכלים שמאחורי האתר - מוסבר בפשטות',
        date: '2026-08-10',
        excerpt:
          'מה מריץ את האתר הזה בשקט - ערימת הקוד הפתוח, הגופנים העבריים, והבחירה לעשות את כל העבודה בדפדפן שלכם כדי שדף הזיכרון לעולם לא יעזוב את המכשיר שלכם.',
      },
    },
  },
]

export function getPostMetaBySlug(slug: string): PostMetaEntry | undefined {
  return POSTS_META.find((post) => post.slug === slug)
}

export const FALLBACK_META: PostMeta = { title: '', date: '', excerpt: '' }

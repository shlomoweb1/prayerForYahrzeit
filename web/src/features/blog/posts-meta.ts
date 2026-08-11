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
      fr: {
        title: 'Comment un PDF peut-il être créé directement dans le navigateur ?',
        date: '2026-08-10',
        excerpt:
          "Chaque feuille commémorative devient un PDF - mais la partie intéressante, c'est comment. Sans serveur, sans capture d'écran : un véritable moteur de mise en page compilé en WebAssembly reconstruit le document directement dans votre navigateur, voyelles hébraïques comprises.",
      },
      es: {
        title: '¿Cómo se puede crear un PDF directamente en el navegador?',
        date: '2026-08-10',
        excerpt:
          'Cada hoja conmemorativa se convierte en un PDF, pero lo interesante es cómo. Sin servidor, sin capturas de pantalla: un motor de maquetación real, compilado a WebAssembly, reconstruye el documento directamente en tu navegador, incluidas las vocales hebreas.',
      },
    },
  },
  {
    slug: 'tools-behind-this-site',
    metaByLocale: {
      en: {
        title: "What's Behind This Website - Explained Simply",
        date: '2026-08-10',
        excerpt:
          "What quietly runs this site - why it's built with free tools, how the Hebrew fonts are prepared, and why the work happens on your device, not ours",
      },
      he: {
        title: 'מה יש מאחורי האתר - מוסבר בפשטות',
        date: '2026-08-10',
        excerpt:
          'מה מפעיל את האתר הזה בשקט - למה הוא בנוי מכלים חופשיים, איך הגופנים העבריים מוכנים, ולמה כל העבודה קורית אצלכם במכשיר ולא אצלנו',
      },
      fr: {
        title: "Ce qu'il y a derrière ce site - expliqué simplement",
        date: '2026-08-10',
        excerpt:
          "Ce qui fait fonctionner ce site en silence - pourquoi il est construit avec des outils libres, comment les polices hébraïques sont préparées, et pourquoi le travail se fait sur votre appareil, pas chez nous",
      },
      es: {
        title: 'Qué hay detrás de este sitio - explicado con sencillez',
        date: '2026-08-10',
        excerpt:
          'Qué hace funcionar este sitio en silencio - por qué está construido con herramientas libres, cómo se preparan las fuentes hebreas, y por qué el trabajo ocurre en tu dispositivo, no en el nuestro',
      },
    },
  },
]

export function getPostMetaBySlug(slug: string): PostMetaEntry | undefined {
  return POSTS_META.find((post) => post.slug === slug)
}

export const FALLBACK_META: PostMeta = { title: '', date: '', excerpt: '' }

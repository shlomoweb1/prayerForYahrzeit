import { siteUrl } from '@/lib/site'

/**
 * Schema.org JSON-LD builders. Every URL is absolute (derived from the
 * canonical SITE_URL) as Google requires for url/image/@id fields. The router
 * head() serializes these via `{ 'script:ld+json': schema }` and escapes them
 * automatically; escapeJsonLd remains the escape for any hand-injected script.
 */

export function buildWebSiteSchema(name: string, description: string, url: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    description,
    url,
  }
}

export function buildOrganizationSchema(
  name: string,
  url: string,
  logoUrl?: string,
  contactEmail?: string,
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
  }
  if (logoUrl) {
    schema.logo = { '@type': 'ImageObject', url: logoUrl }
  }
  if (contactEmail) {
    schema.contactPoint = {
      '@type': 'ContactPoint',
      email: contactEmail,
      contactType: 'customer support',
    }
  }
  return schema
}

export function buildPersonSchema(name: string, url: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url,
  }
}

export function buildWebPageSchema(name: string, url: string, description: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    url,
    description,
  }
}

export function buildContactPageSchema(name: string, url: string, description: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name,
    url,
    description,
  }
}

export interface ArticleSchemaOptions {
  headline: string
  description: string
  datePublished: string
  dateModified: string
  authorName: string
  authorUrl: string
  url: string
  publisherName: string
  publisherLogoUrl: string
}

export function buildArticleSchema(options: ArticleSchemaOptions): Record<string, unknown> {
  const { headline, description, datePublished, dateModified, authorName, authorUrl, url, publisherName, publisherLogoUrl } = options
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    datePublished,
    dateModified,
    author: { '@type': 'Person', name: authorName, url: authorUrl },
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      logo: { '@type': 'ImageObject', url: publisherLogoUrl },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export function buildBreadcrumbs(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/** Absolute URL of the shared OG cover image (1200×630, see public/images/og-cover.jpg). */
export function ogImageUrl(): string {
  return siteUrl('/images/og-cover.jpg')
}

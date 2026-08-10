import { expect, test, type Page } from '@playwright/test'

/** Reads a route's head() output: title, canonical, description, and every JSON-LD block's @type. */
async function readHead(page: Page) {
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
  const description = await page.locator('meta[name="description"]').getAttribute('content')
  const ldTypes = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) =>
    nodes.map((node) => {
      const data = JSON.parse(node.textContent ?? '{}') as { '@type'?: string }
      return data['@type']
    }),
  )
  return { title: await page.title(), canonical, description, ldTypes }
}

test.describe('per-route head (title, canonical, JSON-LD)', () => {
  test('home (he)', async ({ page }) => {
    await page.goto('/')
    const head = await readHead(page)
    expect(head.title).toContain('תפילה לנשמה')
    expect(head.canonical).toMatch(/\/$/)
    expect(head.description).toBeTruthy()
    expect(head.ldTypes).toEqual(expect.arrayContaining(['WebSite', 'Organization']))
  })

  test('home (en)', async ({ page }) => {
    await page.goto('/en')
    const head = await readHead(page)
    expect(head.title).toContain('Prayer for the Soul')
    expect(head.canonical).toMatch(/\/en$/)
    expect(head.ldTypes).toEqual(expect.arrayContaining(['WebSite', 'Organization']))
  })

  test('about', async ({ page }) => {
    await page.goto('/about')
    const head = await readHead(page)
    expect(head.canonical).toMatch(/\/about$/)
    expect(head.ldTypes).toContain('Person')
  })

  test('blog index has a BreadcrumbList', async ({ page }) => {
    await page.goto('/blog')
    const head = await readHead(page)
    expect(head.canonical).toMatch(/\/blog$/)
    expect(head.ldTypes).toContain('BreadcrumbList')
  })

  test('blog post has BlogPosting + BreadcrumbList and hreflang alternates', async ({ page }) => {
    await page.goto('/blog/pdf-in-the-browser')
    const head = await readHead(page)
    expect(head.canonical).toMatch(/\/blog\/pdf-in-the-browser$/)
    expect(head.ldTypes).toEqual(expect.arrayContaining(['BlogPosting', 'BreadcrumbList']))
    const hreflangs = await page.locator('link[rel="alternate"]').evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute('hreflang')),
    )
    expect(hreflangs.sort()).toEqual(['en', 'he', 'x-default'])
  })

  test('unknown blog slug is noindex', async ({ page }) => {
    await page.goto('/blog/this-post-does-not-exist')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
  })

  test('contact has ContactPage schema', async ({ page }) => {
    await page.goto('/contact')
    const head = await readHead(page)
    expect(head.canonical).toMatch(/\/contact$/)
    expect(head.ldTypes).toContain('ContactPage')
  })

  test('privacy renders the policy document', async ({ page }) => {
    await page.goto('/privacy')
    const head = await readHead(page)
    expect(head.canonical).toMatch(/\/privacy$/)
    expect(head.ldTypes).toContain('WebPage')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('wizard stays noindex', async ({ page }) => {
    await page.goto('/wizard')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
  })
})

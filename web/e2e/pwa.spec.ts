import { expect, test } from '@playwright/test'

/**
 * P6-03 PWA checks against the production build (webServer = preview of dist):
 * manifest present, service worker registers and precaches the app shell,
 * the app shell survives going offline. folio.wasm (16 MB) is deliberately
 * NOT precached — the first PDF render fetches it over the network and the
 * runtime-cache rule keeps it for later offline renders.
 */

test('exposes a valid web app manifest with Hebrew metadata', async ({ request }) => {
  const response = await request.get('/manifest.webmanifest')
  expect(response.ok()).toBeTruthy()
  const manifest = (await response.json()) as {
    name?: string
    short_name?: string
    lang?: string
    dir?: string
    icons?: { src: string; sizes: string }[]
    start_url?: string
  }
  expect(manifest.name).toContain('תפילה לנשמה')
  expect(manifest.short_name).toBe('תפילה לנשמה')
  expect(manifest.lang).toBe('he')
  expect(manifest.dir).toBe('rtl')
  expect(manifest.start_url).toBe('/')
  expect(manifest.icons?.some((icon) => icon.sizes === '512x512')).toBeTruthy()
})

test('registers the service worker and precaches the shell without the wasm', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await page.waitForFunction(async () => {
    const registration = await navigator.serviceWorker.ready
    return registration.active?.state === 'activated'
  })
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')

  await page.reload()
  await page.evaluate(
    () =>
      navigator.serviceWorker.ready.then(() => {
        if (!navigator.serviceWorker.controller) {
          return new Promise<void>((resolve) => {
            navigator.serviceWorker.addEventListener('controllerchange', () => resolve())
          })
        }
      }),
  )

  const precacheInfo = await page.evaluate(async () => {
    const keys = await caches.keys()
    const precacheKey = keys.find((key) => key.includes('precache'))
    if (!precacheKey) return { entries: [], hasWasm: false }
    const cache = await caches.open(precacheKey)
    const requests = await cache.keys()
    const urls = requests.map((request) => request.url)
    const pathname = (url: string) => {
      try {
        return new URL(url).pathname
      } catch {
        return url
      }
    }
    return {
      entries: urls.length,
      hasWasm: urls.some((url) => pathname(url).includes('/wasm/')),
      hasShell: urls.some((url) => pathname(url).endsWith('/index.html')),
      hasFont: urls.some((url) => pathname(url).includes('/fonts/NotoSerifHebrew/')),
    }
  })
  expect(precacheInfo.entries).toBeGreaterThan(0)
  expect(precacheInfo.hasShell).toBeTruthy()
  expect(precacheInfo.hasFont).toBeTruthy()
  expect(precacheInfo.hasWasm).toBeFalsy()
})

test('app shell stays usable offline (wizard route included)', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto('/wizard')
  await page.evaluate(() => navigator.serviceWorker.ready)
  await page.reload()
  await page.evaluate(
    () =>
      navigator.serviceWorker.ready.then(() => {
        if (!navigator.serviceWorker.controller) {
          return new Promise<void>((resolve) => {
            navigator.serviceWorker.addEventListener('controllerchange', () => resolve())
          })
        }
      }),
  )

  await context.setOffline(true)
  await page.goto('/wizard')
  await expect(page.getByRole('heading', { name: 'אשף יצירת דף יזכור' })).toBeVisible()
  await context.setOffline(false)
  await context.close()
})

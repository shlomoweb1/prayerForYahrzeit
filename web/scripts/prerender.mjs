import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium } from '@playwright/test'
import { minify } from 'html-minifier-terser'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PORT = process.env.PORT ?? '4173'
const BASE_URL = `http://localhost:${PORT}`

// Same route list as generate-sitemap.mjs (kept in sync by hand for the same
// reason posts-meta.ts is hand-duplicated - see that file's comment). The
// wizard is deliberately excluded: it is noindex, query-string driven, and
// has nothing static worth prerendering.
const BLOG_SLUGS = ['pdf-in-the-browser', 'tools-behind-this-site']
const BARE_PATHS = ['/', '/about', '/accessibility', '/blog', '/contact', '/privacy', ...BLOG_SLUGS.map((slug) => `/blog/${slug}`)]
const ROUTES = BARE_PATHS.flatMap((path) => [path, path === '/' ? '/en' : `/en${path}`])

async function isUp() {
  try {
    const response = await fetch(BASE_URL)
    return response.ok
  } catch {
    return false
  }
}

async function waitForServer(timeoutMs = 30_000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (await isUp()) return
    await new Promise((resolve) => setTimeout(resolve, 300))
  }
  throw new Error(`vite preview did not come up on ${BASE_URL} within ${timeoutMs}ms`)
}

function outputFileFor(path) {
  const trimmed = path === '/' ? '' : path
  return join(ROOT, 'dist', trimmed, 'index.html')
}

// Captures the rendered HTML for a route WITHOUT writing it to dist/ yet.
// `vite preview` serves straight off the dist/ directory for the whole
// crawl, and its SPA fallback serves dist/index.html as the bootstrap
// document for any path that isn't a real file - so writing a route's
// prerendered output mid-crawl would poison every route crawled after it
// (their initial HTML would already contain the previous route's head tags,
// which the new route's portaled head then piles on top of instead of
// replacing). All writes happen only after the whole crawl - and the
// preview server - are done, see run() below.
async function capturePage(page, path) {
  const url = `${BASE_URL}${path}`
  await page.goto(url, { waitUntil: 'networkidle' })
  // Lazy route chunks (component + JSON-LD head) resolve after navigation -
  // wait for both a heading and the route's JSON-LD before snapshotting.
  await page.waitForSelector('h1', { timeout: 10_000 })
  // `<script>` tags are never "visible" (Playwright's default wait state) -
  // wait for it to be attached to the DOM instead.
  await page.waitForSelector('script[type="application/ld+json"]', {
    state: 'attached',
    timeout: 10_000,
  })
  // useLocaleAutoRedirect (features/i18n/route-locale.ts) can navigate a bare
  // path to /en on a "first visit" - the addInitScript below normally
  // prevents that, but assert the URL held in case anything else redirects,
  // rather than silently capturing the wrong route's content for this path.
  const finalPath = new URL(page.url()).pathname
  if (finalPath !== path) {
    throw new Error(`prerendering ${path} ended up at ${finalPath} instead - aborting`)
  }
  await stripInjectedStyles(page)
  return page.content()
}

// Sonner's <Toaster> injects its CSS as a runtime <style> tag rather than an
// external stylesheet, so a raw DOM snapshot bakes a ~15KB copy of it into
// every single prerendered file on top of the already-cached, already shared
// index-*.css link. It carries no SEO value (toasts are invisible until one
// fires) and gets re-injected identically by React the moment a real
// visitor's JS boots, so it is safe to drop before snapshotting.
async function stripInjectedStyles(page) {
  await page.evaluate(() => {
    // eslint-disable-next-line no-undef -- runs in the browser, not Node
    document.querySelectorAll('head > style').forEach((el) => el.remove())
  })
}

// TanStack Router's client-side code-splitting injects <link rel="modulepreload">
// (and similar) tags into document.head at runtime, resolved against
// whatever origin the page is actually running on - during this crawl,
// that's the preview server's http://localhost:PORT, not the real site.
// Left as-is, those absolute dev-origin URLs would 404 in production and
// break hydration. Rewriting them back to root-relative here is the same
// technique dedicated SPA-prerendering tools (e.g. @prerenderer/prerenderer)
// document for the identical problem; root-relative is used rather than the
// real production origin since index.html's own static tags already use
// root-relative paths, so this keeps runtime-injected ones consistent with
// them and portable across custom domains or hosting preview URLs.
function toRelativeUrls(html) {
  return html.replace(/https?:\/\/(localhost|127\.0\.0\.1):\d+/gi, '')
}

// Minifies the final HTML - collapsing whitespace and minifying the inline
// theme/locale FOUC scripts and their surrounding markup - the same
// treatment index.html's own build output already gets from Vite/esbuild.
// A DOM snapshot from a live page is never minified on its own, so without
// this every prerendered file would ship noticeably heavier than the
// original build artifact it was captured from.
async function minifyHtml(html) {
  return minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
  })
}

async function writeCapture(path, html) {
  const file = outputFileFor(path)
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, await minifyHtml(toRelativeUrls(html)))
  console.log(`prerendered ${path} -> ${file.replace(`${ROOT}/`, '')}`)
}

async function run() {
  let previewProcess = null
  if (!(await isUp())) {
    previewProcess = spawn('npm', ['run', 'preview', '--', '--port', PORT, '--strictPort'], {
      cwd: ROOT,
      stdio: 'inherit',
    })
    await waitForServer()
  }

  const browser = await chromium.launch()
  try {
    const page = await browser.newPage()
    // Chromium's default locale is en-US, which would otherwise make the
    // very first bare (Hebrew) route prerendered look like a non-Hebrew
    // browser's first visit and trigger useLocaleAutoRedirect's /en redirect
    // (see features/i18n/route-locale.ts). Seeding a stored locale before
    // every navigation keeps prerendering rendering exactly the route
    // requested, matching how a real crawler - which never runs this JS -
    // would see it.
    await page.addInitScript(() => {
      // eslint-disable-next-line no-undef -- runs in the browser, not Node
      window.localStorage.setItem('izkor:locale:v1', 'he')
    })

    const captures = []
    for (const path of ROUTES) {
      captures.push([path, await capturePage(page, path)])
    }

    // Optional 404 snapshot (see plan note: Firebase's SPA rewrite already
    // sends every unmatched path to /index.html with a 200, so this file is
    // not wired up as an errorPage - it exists for hosts that do support one).
    await page.goto(`${BASE_URL}/this-page-does-not-exist`, { waitUntil: 'networkidle' })
    await page.waitForSelector('h1', { timeout: 10_000 })
    await stripInjectedStyles(page)
    const notFoundHtml = await page.content()

    // Only now, with the crawl finished, write everything to dist/ - see the
    // comment on capturePage for why this can't happen mid-crawl.
    for (const [path, html] of captures) {
      await writeCapture(path, html)
    }
    await writeFile(join(ROOT, 'dist', '404.html'), await minifyHtml(toRelativeUrls(notFoundHtml)))
    console.log('prerendered 404 -> dist/404.html')
  } finally {
    await browser.close()
    if (previewProcess) previewProcess.kill()
  }
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

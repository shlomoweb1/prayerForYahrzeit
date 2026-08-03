import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { launch as chromeLaunch } from 'chrome-launcher'
import lighthouse from 'lighthouse'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PORT = process.env.PORT ?? '4173'
const BASE_URL = `http://localhost:${PORT}`
const MIN_SCORES = {
  accessibility: 90,
  'best-practices': 80,
  seo: 80,
}

const urls = process.argv.slice(2).filter((arg) => arg.startsWith('http'))
const targets = urls.length > 0 ? urls : ['/', '/wizard']

function serve(distDir) {
  return createServer(async (req, res) => {
    try {
      let pathname = decodeURIComponent(new URL(req.url, BASE_URL).pathname)
      if (pathname === '/') pathname = '/index.html'
      const file = await readFile(join(distDir, pathname)).catch(() =>
        readFile(join(distDir, 'index.html')),
      )
      const type = pathname.endsWith('.html') ? 'text/html; charset=utf-8' : 'application/octet-stream'
      res.writeHead(200, { 'content-type': type }).end(file)
    } catch (error) {
      res.writeHead(500).end(String(error))
    }
  })
}

async function isUp() {
  try {
    const response = await fetch(BASE_URL)
    return response.ok
  } catch {
    return false
  }
}

async function run() {
  let server = null
  if (!(await isUp())) {
    const dist = join(ROOT, 'dist')
    server = serve(dist)
    await new Promise((resolve) => server.listen(Number(PORT), resolve))
  }
  const chrome = await chromeLaunch({
    chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'],
  })

  try {
    let failed = false
    for (const path of targets) {
      const url = path.startsWith('http') ? path : `${BASE_URL}${path}`
      const result = await lighthouse(url, {
        port: chrome.port,
        output: 'json',
        onlyCategories: ['accessibility', 'best-practices', 'seo'],
        logLevel: 'error',
      })
      const categories = result.lhr.categories
      for (const [category, minimum] of Object.entries(MIN_SCORES)) {
        const score = Math.round(categories[category].score * 100)
        const status = score >= minimum ? 'PASS' : 'FAIL'
        if (status === 'FAIL') failed = true
        console.log(`${status}  ${category.padEnd(15)} ${String(score).padStart(3)}/100  ${url}`)
      }
    }
    if (failed) {
      console.error('Lighthouse audit failed: scores below thresholds.')
      process.exitCode = 1
    }
  } finally {
    await chrome.kill()
    if (server) server.close()
  }
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

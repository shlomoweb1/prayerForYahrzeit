/**
 * Appends `?v=<contentHash>` to index.html's two synchronous head scripts
 * (public/scripts/theme-init.js, locale-init.js). They are plain files under
 * public/ (copied verbatim, no content-hashed filename like Vite gives
 * imported assets), so without this an edit would stay cached under the same
 * URL indefinitely - same reasoning as wasm-version.ts, reusing its
 * fileVersion() helper.
 */
import path from 'node:path'
import type { Plugin } from 'vite'

import { fileVersion } from './file-version.ts'

const HEAD_SCRIPTS = ['scripts/theme-init.js', 'scripts/locale-init.js']

export function headScriptsVersion(): Plugin {
  let publicDir: string

  return {
    name: 'izkor:head-scripts-version',
    configResolved(config) {
      publicDir = config.publicDir
    },
    transformIndexHtml(html) {
      return HEAD_SCRIPTS.reduce((out, rel) => {
        const version = fileVersion(path.join(publicDir, rel))
        return out.replace(`src="/${rel}"`, `src="/${rel}?v=${version}"`)
      }, html)
    },
  }
}

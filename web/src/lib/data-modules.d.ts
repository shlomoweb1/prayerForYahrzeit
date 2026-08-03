/**
 * Ambient types for the committed Phase-4 JSON datasets. The app is fully
 * offline: the files under ../../../data/ (repo root `data/`) are bundled by Vite at build time and
 * cast to the typed shapes below by the accessor modules.
 */

declare module '*.json' {
  const value: unknown
  export default value
}

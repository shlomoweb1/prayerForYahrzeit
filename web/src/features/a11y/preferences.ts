export const A11Y_STORAGE_KEY = 'izkor:a11y:v1'
export const A11Y_VERSION = 1

export const A11Y_CLASS_PREFIX = 'a11y-'

export interface A11yPreferences {
  contrast: boolean
  mono: boolean
  textSize: 100 | 125 | 150
  lineSpacing: boolean
  wordSpacing: boolean
  letterSpacing: boolean
  readableFont: boolean
  highlightLinks: boolean
  highlightHeadings: boolean
  largeCursor: boolean
  stopAnimations: boolean
}

export const defaultA11yPreferences: A11yPreferences = {
  contrast: false,
  mono: false,
  textSize: 100,
  lineSpacing: false,
  wordSpacing: false,
  letterSpacing: false,
  readableFont: false,
  highlightLinks: false,
  highlightHeadings: false,
  largeCursor: false,
  stopAnimations: false,
}

const TEXT_SIZES: A11yPreferences['textSize'][] = [100, 125, 150]

function isTextSize(value: unknown): value is A11yPreferences['textSize'] {
  return TEXT_SIZES.includes(value as A11yPreferences['textSize'])
}

export function normalizeA11yPreferences(value: unknown): A11yPreferences {
  if (!value || typeof value !== 'object') {
    return { ...defaultA11yPreferences }
  }
  const raw = value as Record<string, unknown>
  const textSize = isTextSize(raw.textSize) ? raw.textSize : defaultA11yPreferences.textSize
  return {
    contrast: raw.contrast === true,
    mono: raw.mono === true,
    textSize,
    lineSpacing: raw.lineSpacing === true,
    wordSpacing: raw.wordSpacing === true,
    letterSpacing: raw.letterSpacing === true,
    readableFont: raw.readableFont === true,
    highlightLinks: raw.highlightLinks === true,
    highlightHeadings: raw.highlightHeadings === true,
    largeCursor: raw.largeCursor === true,
    stopAnimations: raw.stopAnimations === true,
  }
}

export function buildA11yClasses(prefs: A11yPreferences): string[] {
  const classes: string[] = []
  if (prefs.contrast) classes.push(`${A11Y_CLASS_PREFIX}contrast`)
  if (prefs.mono) classes.push(`${A11Y_CLASS_PREFIX}mono`)
  if (prefs.textSize !== 100) classes.push(`${A11Y_CLASS_PREFIX}text-${prefs.textSize}`)
  if (prefs.lineSpacing) classes.push(`${A11Y_CLASS_PREFIX}line-spacing`)
  if (prefs.wordSpacing) classes.push(`${A11Y_CLASS_PREFIX}word-spacing`)
  if (prefs.letterSpacing) classes.push(`${A11Y_CLASS_PREFIX}letter-spacing`)
  if (prefs.readableFont) classes.push(`${A11Y_CLASS_PREFIX}readable-font`)
  if (prefs.highlightLinks) classes.push(`${A11Y_CLASS_PREFIX}highlight-links`)
  if (prefs.highlightHeadings) classes.push(`${A11Y_CLASS_PREFIX}highlight-headings`)
  if (prefs.largeCursor) classes.push(`${A11Y_CLASS_PREFIX}large-cursor`)
  if (prefs.stopAnimations) classes.push(`${A11Y_CLASS_PREFIX}stop-animations`)
  return classes
}

export function applyA11yClasses(
  prefs: A11yPreferences,
  root: HTMLElement = document.documentElement,
): string[] {
  const toRemove = Array.from(root.classList).filter((name) =>
    name.startsWith(A11Y_CLASS_PREFIX),
  )
  root.classList.remove(...toRemove)
  const toAdd = buildA11yClasses(prefs)
  root.classList.add(...toAdd)
  return toAdd
}

export function loadA11yPreferences(storage: Storage = localStorage): A11yPreferences {
  let raw: unknown
  try {
    const stored = storage.getItem(A11Y_STORAGE_KEY)
    raw = stored ? JSON.parse(stored) : null
  } catch {
    raw = null
  }
  return normalizeA11yPreferences(raw)
}

export function saveA11yPreferences(
  prefs: A11yPreferences,
  storage: Storage = localStorage,
): void {
  storage.setItem(A11Y_STORAGE_KEY, JSON.stringify(prefs))
}

export function resetA11yPreferences(
  storage: Storage = localStorage,
): A11yPreferences {
  storage.removeItem(A11Y_STORAGE_KEY)
  return { ...defaultA11yPreferences }
}

export function isA11yVersionedKey(key: string): boolean {
  return key === A11Y_STORAGE_KEY
}

export const THEME_STORAGE_KEY = 'izkor:theme:v1'
export const THEME_VERSION = 1

export const THEME_IDS = ['dusk', 'parchment', 'stone'] as const
export const THEME_MODES = ['light', 'dark'] as const

export type ThemeId = (typeof THEME_IDS)[number]
export type ThemeMode = (typeof THEME_MODES)[number]

export interface ThemeState {
  theme: ThemeId
  mode: ThemeMode
}

/** Which mode each theme opens with before the user overrides it. */
const THEME_DEFAULT_MODE: Record<ThemeId, ThemeMode> = {
  dusk: 'dark',
  parchment: 'light',
  stone: 'light',
}

export const defaultThemeState: ThemeState = {
  theme: 'dusk',
  mode: 'dark',
}

export function isThemeId(value: unknown): value is ThemeId {
  return THEME_IDS.includes(value as ThemeId)
}

export function isThemeMode(value: unknown): value is ThemeMode {
  return THEME_MODES.includes(value as ThemeMode)
}

export function normalizeThemeState(value: unknown): ThemeState {
  if (!value || typeof value !== 'object') {
    return { ...defaultThemeState }
  }
  const raw = value as Record<string, unknown>
  const theme = isThemeId(raw.theme) ? raw.theme : defaultThemeState.theme
  const mode = isThemeMode(raw.mode) ? raw.mode : THEME_DEFAULT_MODE[theme]
  return { theme, mode }
}

export function themeModeFor(theme: ThemeId, startingFrom?: ThemeMode): ThemeMode {
  if (startingFrom === 'light' || startingFrom === 'dark') return startingFrom
  return THEME_DEFAULT_MODE[theme]
}

/**
 * Applies the active theme to the document root so all tokens resolve before
 * React mounts (used both by the provider and the inline index.html bootstrap).
 */
export function applyThemeState(state: ThemeState, root: HTMLElement = document.documentElement): void {
  root.dataset.theme = state.theme
  root.dataset.themeMode = state.mode
  root.style.colorScheme = state.mode
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (meta) meta.content = THEME_META_COLORS[state.theme][state.mode]
}

export function loadThemeState(storage: Storage = localStorage): ThemeState {
  let raw: unknown
  try {
    const stored = storage.getItem(THEME_STORAGE_KEY)
    raw = stored ? JSON.parse(stored) : null
  } catch {
    raw = null
  }
  return normalizeThemeState(raw)
}

export function saveThemeState(state: ThemeState, storage: Storage = localStorage): void {
  storage.setItem(THEME_STORAGE_KEY, JSON.stringify(state))
}

/** theme-color meta value per theme+mode, kept in sync with the CSS tokens. */
export const THEME_META_COLORS: Record<ThemeId, Record<ThemeMode, string>> = {
  dusk: { light: '#efe9e0', dark: '#141a2e' },
  parchment: { light: '#f3ede0', dark: '#241c13' },
  stone: { light: '#ede9dd', dark: '#1e2018' },
}
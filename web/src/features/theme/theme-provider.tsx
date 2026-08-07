import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  applyThemeState,
  loadThemeState,
  saveThemeState,
  THEME_IDS,
  type ThemeId,
  type ThemeMode,
  type ThemeState,
} from '@/features/theme/themes'

interface ThemeContextValue {
  theme: ThemeId
  mode: ThemeMode
  setTheme: (theme: ThemeId) => void
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
  cycleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ThemeState>(() => loadThemeState())

  useEffect(() => {
    applyThemeState(state)
  }, [state])

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode: state.mode,
      theme: state.theme,
      setTheme: (theme) =>
        setState((current) => {
          const next = { ...current, theme }
          saveThemeState(next)
          return next
        }),
      setMode: (mode) => {
        setState((current) => {
          const next = { ...current, mode }
          saveThemeState(next)
          return next
        })
      },
      toggleMode: () => {
        setState((current) => {
          const mode: ThemeMode = current.mode === 'dark' ? 'light' : 'dark'
          const next = { ...current, mode }
          saveThemeState(next)
          return next
        })
      },
      cycleTheme: () => {
        setState((current) => {
          const index = THEME_IDS.indexOf(current.theme)
          const next = {
            ...current,
            theme: THEME_IDS[(index + 1) % THEME_IDS.length] ?? current.theme,
          }
          saveThemeState(next)
          return next
        })
      },
    }),
    [state],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}
import { createContext, useContext } from 'react'

import type { ThemeId, ThemeMode } from '@/features/theme/themes'

export interface ThemeContextValue {
  theme: ThemeId
  mode: ThemeMode
  setTheme: (theme: ThemeId) => void
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
  cycleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}

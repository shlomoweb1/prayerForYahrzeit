import { MoonIcon, SunIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/features/theme'

/**
 * Compact light/dark toggle for the footer. The full theme picker
 * (themes + hero image) lives in the theme settings dialog.
 */
export function ThemeToggle() {
  const { t } = useTranslation()
  const { mode, toggleMode } = useTheme()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleMode}
      aria-pressed={mode === 'dark'}
      aria-label={t(mode === 'dark' ? 'theme.mode.dark' : 'theme.mode.light')}
      className="justify-between"
    >
      {mode === 'dark' ? <MoonIcon className="size-4" /> : <SunIcon className="size-4" />}
      {t(mode === 'dark' ? 'theme.mode.dark' : 'theme.mode.light')}
    </Button>
  )
}

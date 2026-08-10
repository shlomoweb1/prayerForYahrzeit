import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { LanguagesIcon } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { applyLocale, SUPPORTED_LOCALES, type SupportedLocale } from '@/features/i18n'
import {
  isLocaleNeutralPath,
  localizedPath,
  useRouteLocale,
  type RouteLocale,
} from '@/features/i18n/route-locale'

interface LocalePickerProps {
  className?: string
}

/**
 * On content pages the picker moves the URL between the locale forms (bare =
 * Hebrew, /en = English; es/fr share the English form), because the route
 * locale owns the language there. On the locale-neutral wizard it is a plain
 * UI-language switch and nothing navigates.
 */
export function LocalePicker({ className }: LocalePickerProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const routeLocale = useRouteLocale()
  const neutral = isLocaleNeutralPath(pathname)

  const current: SupportedLocale = neutral
    ? ((i18n.resolvedLanguage ?? 'he') as SupportedLocale)
    : routeLocale

  const handleChange = (value: string) => {
    const locale = value as SupportedLocale
    applyLocale(locale)
    void i18n.changeLanguage(locale)
    if (neutral) return
    const form: RouteLocale = locale === 'he' ? 'he' : 'en'
    const target = localizedPath(pathname, form)
    if (target !== pathname) {
      void navigate({ to: target })
    }
  }

  return (
    <div className={className}>
      <Select value={current} onValueChange={handleChange} aria-label={t('common.localeNames.en')}>
        <SelectTrigger className="w-fit" aria-label={t('common.localeNames.en')}>
          <LanguagesIcon className="size-4" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_LOCALES.map((locale) => (
            <SelectItem key={locale} value={locale}>
              {t(`common.localeNames.${locale}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

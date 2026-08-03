import { useTranslation } from 'react-i18next'
import { LanguagesIcon } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { applyLocale, SUPPORTED_LOCALES, type SupportedLocale } from '@/features/i18n'

interface LocalePickerProps {
  className?: string
}

export function LocalePicker({ className }: LocalePickerProps) {
  const { t, i18n } = useTranslation()
  const current = (i18n.resolvedLanguage ?? 'he') as SupportedLocale

  const handleChange = (value: string) => {
    void i18n.changeLanguage(value)
    applyLocale(value as SupportedLocale)
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

import { useTranslation } from 'react-i18next'

import { DocRenderer } from '@/features/content/DocRenderer'
import { useLocalizedContent } from '@/features/content/useLocalizedContent'

import privacyEn from '@/content/privacy/privacy.en.md?raw'
import privacyHe from '@/content/privacy/privacy.he.md?raw'

const UPDATED_AT = '2026-08-10'

/**
 * Renders the privacy statement for the URL's locale form (es/fr fall back
 * to the English body, same convention as the blog and about bios).
 */
export function PrivacyContent() {
  const { t } = useTranslation()
  const content = useLocalizedContent({ he: privacyHe, en: privacyEn }, privacyEn)

  return (
    <DocRenderer
      content={content}
      withToc
      header={
        <header className="mb-6 text-center">
          <h1 className="font-display text-3xl font-bold text-gold lang-he:font-keter sm:text-4xl">
            {t('privacyPage.title')}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {t('privacyPage.updatedAt')}: {UPDATED_AT}
          </p>
        </header>
      }
    />
  )
}

import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground text-sm">{t('common.notFound.description')}</p>
      <Link to="/" className="text-sm">
        {t('common.notFound.backHome')}
      </Link>
    </div>
  )
}

export function NotFoundComponent() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="text-muted-foreground text-sm">{t('common.notFound.description')}</p>
      <Link to="/" className="text-sm">
        {t('common.notFound.backHome')}
      </Link>
    </div>
  )
}
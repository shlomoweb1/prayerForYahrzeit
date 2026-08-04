import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'



export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="border-t bg-background/60 backdrop-blur">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-2 px-4 py-6">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} {t('common.brand')} — {t('common.footer.rights')}
        </p>
        <Link to="/accessibility" className="text-sm">
          {t('common.footer.accessibility')}
        </Link>
      </div>
    </footer>
  )
}
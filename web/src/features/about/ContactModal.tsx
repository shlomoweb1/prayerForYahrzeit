import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ContactForm } from './ContactForm'

/**
 * Contact entry point: the CTA button carries the same label as the dialog
 * title ("Contact"), so the action name stays consistent through the flow.
 */
export function ContactModal() {
  const { t } = useTranslation()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full max-w-xs">
          {t('aboutPage.contact.title')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-gold lang-he:font-keter">
            {t('aboutPage.contact.title')}
          </DialogTitle>
          <DialogDescription>{t('aboutPage.contact.description')}</DialogDescription>
        </DialogHeader>
        <ContactForm />
      </DialogContent>
    </Dialog>
  )
}

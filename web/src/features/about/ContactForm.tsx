import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

// After your first submission, FormSubmit sends a confirmation email; clicking
// it activates the form and gives you a random string for this URL. Use that
// string so your real address never appears in the page source.
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/REPLACE_ME'

const FIELD_CLASSES =
  'border-input placeholder:text-muted-foreground flex w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm'

export function ContactForm() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return

    const form = new FormData(event.currentTarget)
    const honey = form.get('_honey')
    if (typeof honey === 'string' && honey.length > 0) {
      // Bot-filled honeypot — silently ignore.
      setSending(true)
      setTimeout(() => setSending(false), 1500)
      return
    }

    setSending(true)
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email,
          message,
          _subject: t('aboutPage.contact.subject'),
          _template: 'table',
          _honey: '',
        }),
      })
      // FormSubmit always answers 200; the real status lives in the JSON body.
      const data = (await response.json()) as { success?: string | boolean }
      if (!response.ok || String(data.success) !== 'true') {
        throw new Error(`FormSubmit rejected the submission: ${response.status}`)
      }
      toast.success(t('aboutPage.contact.success'))
      setEmail('')
      setMessage('')
    } catch {
      toast.error(t('aboutPage.contact.error'))
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="contact-email">{t('aboutPage.contact.emailLabel')}</Label>
        <Input
          id="contact-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('aboutPage.contact.emailPlaceholder')}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="contact-message">{t('aboutPage.contact.messageLabel')}</Label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('aboutPage.contact.messagePlaceholder')}
          className={cn(FIELD_CLASSES, 'min-h-28 resize-y py-2 leading-relaxed')}
        />
      </div>
      <input
        type="text"
        name="_honey"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <Button type="submit" disabled={sending} className="justify-self-start">
        {sending ? t('aboutPage.contact.sending') : t('aboutPage.contact.send')}
      </Button>
    </form>
  )
}

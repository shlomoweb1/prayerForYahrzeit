import { AccessibilityIcon, RotateCcwIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  applyA11yClasses,
  loadA11yPreferences,
  resetA11yPreferences,
  saveA11yPreferences,
  type A11yPreferences,
} from '@/features/a11y/preferences'
import { cn } from '@/lib/utils'

type ToggleKey = Exclude<keyof A11yPreferences, 'textSize'>
type ToggleLabelKey = `a11y.toggles.${ToggleKey}`

interface A11yToggle {
  key: ToggleKey
  labelKey: ToggleLabelKey
}

const TOGGLES: A11yToggle[] = [
  { key: 'contrast', labelKey: 'a11y.toggles.contrast' },
  { key: 'mono', labelKey: 'a11y.toggles.mono' },
  { key: 'lineSpacing', labelKey: 'a11y.toggles.lineSpacing' },
  { key: 'wordSpacing', labelKey: 'a11y.toggles.wordSpacing' },
  { key: 'letterSpacing', labelKey: 'a11y.toggles.letterSpacing' },
  { key: 'readableFont', labelKey: 'a11y.toggles.readableFont' },
  { key: 'highlightLinks', labelKey: 'a11y.toggles.highlightLinks' },
  { key: 'highlightHeadings', labelKey: 'a11y.toggles.highlightHeadings' },
  { key: 'largeCursor', labelKey: 'a11y.toggles.largeCursor' },
  { key: 'stopAnimations', labelKey: 'a11y.toggles.stopAnimations' },
]

export function A11yWidget() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [prefs, setPrefs] = useState<A11yPreferences>(() => loadA11yPreferences())

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'KeyA' && event.altKey) {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const updatePrefs = (patch: Partial<A11yPreferences>) => {
    setPrefs((current) => {
      const next = { ...current, ...patch }
      saveA11yPreferences(next)
      applyA11yClasses(next)
      toast(t('a11y.applied'))
      return next
    })
  }

  const handleReset = () => {
    const next = resetA11yPreferences()
    setPrefs(next)
    applyA11yClasses(next)
    toast(t('a11y.reset'))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <AccessibilityIcon className="size-4" />
          <span>{t('a11y.open')}</span>
          <kbd className="bg-muted rounded-sm px-1.5 text-xs text-foreground">
            Alt+A
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('a11y.widgetTitle')}</DialogTitle>
          <DialogDescription>{t('a11y.widgetDescription')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex items-center justify-between gap-4">
            <Label>{t('a11y.textSize')}</Label>
            <Select
              value={String(prefs.textSize)}
              onValueChange={(value) =>
                updatePrefs({ textSize: Number(value) as A11yPreferences['textSize'] })
              }
            >
              <SelectTrigger className="w-28" aria-label={t('a11y.textSize')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {([100, 125, 150] as const).map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {t('a11y.textSizeValue', { size })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="grid gap-3">
            {TOGGLES.map((toggle) => (
              <div
                key={toggle.key}
                className={cn('flex items-center justify-between gap-4')}
              >
                <Label htmlFor={`a11y-${toggle.key}`}>{t(toggle.labelKey)}</Label>
                <Switch
                  id={`a11y-${toggle.key}`}
                  aria-label={t(toggle.labelKey)}
                  checked={prefs[toggle.key]}
                  onCheckedChange={(checked) => updatePrefs({ [toggle.key]: checked })}
                />
              </div>
            ))}
          </div>
          <Separator />
          <Button variant="outline" onClick={handleReset}>
            <RotateCcwIcon className="size-4" />
            {t('a11y.reset')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

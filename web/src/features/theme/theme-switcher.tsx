import { PaintbrushIcon } from 'lucide-react'
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
import {
  THEME_IDS, useTheme,
  type ThemeId
} from '@/features/theme'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './theme-toggle'

const THEME_SWATCHES: Record<ThemeId, [string, string, string]> = {
  dusk: ['#141a2e', '#2a3148', '#f0b84d'],
  parchment: ['#f3ede0', '#e8dcc3', '#a8842c'],
  stone: ['#ede9dd', '#e2dcc8', '#7a8f5a'],
}

export function ThemeSwitcher() {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" aria-label={t('theme.open')} title={t('theme.open')}>
          <PaintbrushIcon className="size-4" />
          <span className="sr-only sm:not-sr-only">{t('theme.open')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('theme.dialogTitle')}</DialogTitle>
          <DialogDescription>{t('theme.dialogDescription')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2" role="group" aria-label={t('theme.themeGroup')}>
            {THEME_IDS.map((themeId) => {
              const [bg, surface, accent] = THEME_SWATCHES[themeId]
              const selected = theme === themeId
              return (
                <button
                  key={themeId}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setTheme(themeId)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-md border p-3 text-start transition-colors',
                    'focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none',
                    selected
                      ? 'border-ring bg-accent/20 ring-2 ring-ring/60'
                      : 'border-input hover:bg-accent/40',
                  )}
                >
                  <span
                    aria-hidden
                    className="flex h-8 w-12 shrink-0 items-center gap-1 rounded-sm border p-1"
                    style={{ backgroundColor: bg, borderColor: surface }}
                  >
                    <span className="h-full w-1/2 rounded-[2px]" style={{ backgroundColor: surface }} />
                    <span className="h-1.5 w-full rounded-full" style={{ backgroundColor: accent }} />
                  </span>
                  <span className="text-sm font-medium">{t(`theme.themes.${themeId}`)}</span>
                </button>
              )
            })}
          </div>

          <ThemeToggle />

          {/* <div className="grid gap-2">
            <p className="text-sm font-medium">{t('theme.heroGroup')}</p>
            <div className="grid gap-2">
              {HERO_IMAGES.map((hero) => {
                const selected =
                  choice.mode === 'pinned' && choice.imageId === hero.id
                return (
                  <button
                    key={hero.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setPinned(hero.id)}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-md border p-2 text-start transition-colors',
                      'focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none',
                      selected
                        ? 'border-ring bg-accent/20 ring-2 ring-ring/60'
                        : 'border-input hover:bg-accent/40',
                    )}
                  >
                    <img
                      src={hero.src}
                      alt=""
                      className="h-10 w-16 shrink-0 rounded-sm object-cover"
                      loading="lazy"
                    />
                    <span className="text-sm">{t(hero.altKey)}</span>
                  </button>
                )
              })}
              <div className="flex gap-2">
                <Button
                  variant={choice.mode === 'auto' ? 'secondary' : 'outline'}
                  className="flex-1"
                  onClick={setAuto}
                  aria-pressed={choice.mode === 'auto'}
                >
                  {t('theme.heroAuto')}
                </Button>
                <Button
                  variant={choice.mode === 'random' ? 'secondary' : 'outline'}
                  className="flex-1"
                  onClick={shuffle}
                  aria-pressed={choice.mode === 'random'}
                >
                  <ShuffleIcon className="size-4" />
                  {t('theme.heroRandom')}
                </Button>
              </div>
            </div>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  )
}
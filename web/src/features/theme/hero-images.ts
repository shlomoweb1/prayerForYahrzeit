import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'

import { useTheme } from '@/features/theme/theme-provider'
import type { ThemeId } from '@/features/theme/themes'

export const HERO_STORAGE_KEY = 'izkor:hero:v1'

type HeroAltKey =
  | 'theme.heroImages.candleDusk'
  | 'theme.heroImages.marbleParchment'
  | 'theme.heroImages.tombstoneOlives'

export interface HeroImageDef {
  id: string
  /** URL currently served for this hero. Swap to a generated image once it exists. */
  src: string
  /** Which theme this image was art-directed for. */
  theme: ThemeId
  /** i18n key for the alt / label text. */
  altKey: HeroAltKey
  /** Prompt file (images/prompts/*.md) that produced this image. */
  promptFile: string
}

export const HERO_IMAGES: HeroImageDef[] = [
  {
    id: 'candle-dusk',
    src: '/images/Yorzait-candle-sunset.png',
    theme: 'dusk',
    altKey: 'theme.heroImages.candleDusk',
    promptFile: '01-hero-dusk-candle.md',
  },
  {
    id: 'marble-parchment',
    src: '/images/magnific_subtle-marble-and-fine-ha_yi4LguxPW9.jpg',
    theme: 'parchment',
    altKey: 'theme.heroImages.marbleParchment',
    promptFile: '02-hero-parchment-window.md',
  },
  {
    id: 'tombstone-olives',
    src: '/images/kadish-on-tumbe.png',
    theme: 'stone',
    altKey: 'theme.heroImages.tombstoneOlives',
    promptFile: '03-hero-mount-olives.md',
  },
]

export type HeroChoiceMode = 'auto' | 'random' | 'pinned'

export interface HeroChoice {
  mode: HeroChoiceMode
  /** image id, used when mode === 'pinned' (and remembered after random picks). */
  imageId?: string
}

const DEFAULT_CHOICE: HeroChoice = { mode: 'auto' }

const HERO_QUERY_KEY = ['hero-choice'] as const

function readHeroChoice(storage: Storage = localStorage): HeroChoice {
  let raw: unknown
  try {
    const stored = storage.getItem(HERO_STORAGE_KEY)
    raw = stored ? JSON.parse(stored) : null
  } catch {
    raw = null
  }
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_CHOICE }
  const candidate = raw as Partial<HeroChoice>
  const mode = candidate.mode === 'random' || candidate.mode === 'pinned' ? candidate.mode : 'auto'
  return { mode, imageId: mode === 'auto' ? undefined : candidate.imageId }
}

function persistHeroChoice(choice: HeroChoice, storage: Storage = localStorage): void {
  storage.setItem(HERO_STORAGE_KEY, JSON.stringify(choice))
}

export function heroForTheme(theme: ThemeId): HeroImageDef {
  return HERO_IMAGES.find((image) => image.theme === theme) ?? HERO_IMAGES[0]!
}

function randomHero(excludeId?: string): HeroImageDef {
  const pool = HERO_IMAGES.filter((image) => image.id !== excludeId)
  return pool[Math.floor(Math.random() * pool.length)] ?? HERO_IMAGES[0]!
}

/**
 * The hero background is a product choice (not a mode toggle), so it lives in
 * TanStack Query state and is persisted to localStorage. mode 'auto' follows
 * the active theme; 'random' picks a fresh image on every call; 'pinned' holds
 * one image id.
 */
export function useHeroImage() {
  const queryClient = useQueryClient()
  const { theme } = useTheme()

  const { data: choice } = useQuery({
    queryKey: HERO_QUERY_KEY,
    queryFn: () => readHeroChoice(),
    initialData: { ...DEFAULT_CHOICE },
    staleTime: Infinity,
  })

  const persist = useMutation({
    mutationFn: async (next: HeroChoice) => {
      persistHeroChoice(next)
      return next
    },
    onSuccess: (next) => {
      queryClient.setQueryData(HERO_QUERY_KEY, next)
    },
  })

  const image = useMemo<HeroImageDef>(() => {
    if (choice.mode === 'random') return randomHero()
    if (choice.mode === 'pinned' && choice.imageId) {
      const pinned = HERO_IMAGES.find((candidate) => candidate.id === choice.imageId)
      if (pinned) return pinned
    }
    return heroForTheme(theme)
  }, [choice, theme])

  return {
    choice,
    image,
    setAuto: () => void persist.mutate({ mode: 'auto' }),
    setPinned: (imageId: string) => void persist.mutate({ mode: 'pinned', imageId }),
    shuffle: () => void persist.mutate({ mode: 'random' }),
  }
}
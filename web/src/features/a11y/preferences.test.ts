import { describe, expect, it } from 'vitest'

import {
  A11Y_STORAGE_KEY,
  applyA11yClasses,
  buildA11yClasses,
  defaultA11yPreferences,
  loadA11yPreferences,
  resetA11yPreferences,
  saveA11yPreferences,
  type A11yPreferences,
} from '@/features/a11y/preferences'

function storageMock(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial))
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
    clear: () => store.clear(),
  } as unknown as Storage
}

describe('a11y preferences store', () => {
  it('round-trips preferences through storage', () => {
    const storage = storageMock()
    const prefs: A11yPreferences = {
      ...defaultA11yPreferences,
      contrast: true,
      textSize: 150,
      largeCursor: true,
      stopAnimations: true,
    }
    saveA11yPreferences(prefs, storage)
    expect(loadA11yPreferences(storage)).toEqual(prefs)
  })

  it('returns defaults when storage is empty or corrupt', () => {
    expect(loadA11yPreferences(storageMock())).toEqual(defaultA11yPreferences)
    expect(loadA11yPreferences(storageMock({ [A11Y_STORAGE_KEY]: '{oops' }))).toEqual(
      defaultA11yPreferences,
    )
    expect(loadA11yPreferences(storageMock({ [A11Y_STORAGE_KEY]: 'null' }))).toEqual(
      defaultA11yPreferences,
    )
  })

  it('normalizes unknown values to safe types', () => {
    const storage = storageMock({
      [A11Y_STORAGE_KEY]: JSON.stringify({
        contrast: 'yes',
        mono: 1,
        textSize: 999,
        lineSpacing: true,
      }),
    })
    const prefs = loadA11yPreferences(storage)
    expect(prefs.contrast).toBe(false)
    expect(prefs.mono).toBe(false)
    expect(prefs.textSize).toBe(100)
    expect(prefs.lineSpacing).toBe(true)
  })

  it('reset clears storage and returns defaults', () => {
    const storage = storageMock({
      [A11Y_STORAGE_KEY]: JSON.stringify({ ...defaultA11yPreferences, mono: true }),
    })
    const prefs = resetA11yPreferences(storage)
    expect(prefs).toEqual(defaultA11yPreferences)
    expect(storage.getItem(A11Y_STORAGE_KEY)).toBeNull()
  })

  it('uses a versioned storage key', () => {
    expect(A11Y_STORAGE_KEY).toMatch(/^izkor:a11y:v\d+$/)
  })

  describe('FOUC class application logic', () => {
    it('builds the expected class list from preferences', () => {
      const prefs: A11yPreferences = {
        ...defaultA11yPreferences,
        contrast: true,
        textSize: 125,
        highlightLinks: true,
      }
      expect(buildA11yClasses(prefs)).toEqual([
        'a11y-contrast',
        'a11y-text-125',
        'a11y-highlight-links',
      ])
      expect(buildA11yClasses(defaultA11yPreferences)).toEqual([])
    })

    it('applies classes to the root element and removes stale ones', () => {
      const root = document.createElement('html')
      root.className = 'a11y-contrast a11y-mono other'
      const added = applyA11yClasses(
        { ...defaultA11yPreferences, lineSpacing: true, textSize: 150 },
        root,
      )
      expect(added).toEqual(['a11y-text-150', 'a11y-line-spacing'])
      expect(root.classList.contains('a11y-contrast')).toBe(false)
      expect(root.classList.contains('other')).toBe(true)
    })

    it('applies nothing when preferences match defaults', () => {
      const root = document.createElement('html')
      root.className = 'a11y-mono'
      applyA11yClasses(defaultA11yPreferences, root)
      expect(root.className).toBe('')
    })
  })
})

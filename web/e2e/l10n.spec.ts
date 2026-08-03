import { expect, test, type Page } from '@playwright/test'

const LOCALES = [
  { code: 'he', dir: 'rtl' },
  { code: 'en', dir: 'ltr' },
  { code: 'es', dir: 'ltr' },
  { code: 'fr', dir: 'ltr' },
] as const

const STEPS = [1, 2, 3, 4, 5, 6, 7] as const

function prefilledWizardUrl(step: number): string {
  const params = new URLSearchParams({
    step: String(step),
    target: 'both',
    paper: 'a4',
    gender: 'male',
    nusach: 'ashkenaz',
    name: 'משה בן אברהם',
    parent: 'אברהם',
    font: 'noto-serif',
    nikud: '1',
    deco: '1',
    acrostic: 'both',
    blessing: '0',
    sections: 'psalms,neshama,kaddish,mishnayot,hashkava,closing',
  })
  return `/wizard?${params.toString()}`
}

/** Boot every page in the given locale (FOUC script + i18n both read it). */
async function setLocale(page: Page, code: string): Promise<void> {
  await page.addInitScript((locale) => {
    window.localStorage.setItem('izkor:locale:v1', locale)
  }, code)
}

/** Step 7 renders the sheet preview with embedded data-URI fonts — wait for them. */
async function waitForFonts(page: Page): Promise<void> {
  await page.evaluate(() => document.fonts.ready.then(() => true))
}

for (const { code, dir } of LOCALES) {
  test.describe(`locale ${code}`, () => {
    test('app shell respects dir and lang', async ({ page }) => {
      await setLocale(page, code)
      await page.goto('/')
      await expect(page.locator('html')).toHaveAttribute('lang', code)
      await expect(page.locator('html')).toHaveAttribute('dir', dir)
    })

    test('landing page renders', async ({ page }) => {
      await setLocale(page, code)
      await page.goto('/')
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    })

    test('accessibility page renders', async ({ page }) => {
      await setLocale(page, code)
      await page.goto('/accessibility')
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    })

    test('wizard keeps keyboard-only navigation working', async ({ page }) => {
      await setLocale(page, code)
      await page.goto('/wizard')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
      await expect(page).toHaveURL(/step=2/)
    })
  })
}

for (const { code } of LOCALES) {
  test.describe(`snapshots ${code} mobile`, () => {
    test.use({ viewport: { width: 375, height: 667 } })

    test('landing', async ({ page }) => {
      await setLocale(page, code)
      await page.goto('/')
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await expect(page).toHaveScreenshot(`${code}-mobile-landing.png`, { fullPage: true })
    })

    test('accessibility', async ({ page }) => {
      await setLocale(page, code)
      await page.goto('/accessibility')
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await expect(page).toHaveScreenshot(`${code}-mobile-accessibility.png`, { fullPage: true })
    })

    for (const step of STEPS) {
      test(`wizard step ${step}`, async ({ page }) => {
        await setLocale(page, code)
        await page.goto(prefilledWizardUrl(step))
        await expect(page).toHaveURL(/step=/)
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
        if (step === 7) await waitForFonts(page)
        await expect(page).toHaveScreenshot(`${code}-mobile-wizard-step-${step}.png`, {
          fullPage: true,
          timeout: step === 7 ? 30_000 : 10_000,
        })
      })
    }
  })

  test.describe(`snapshots ${code} desktop`, () => {
    test.use({ viewport: { width: 1280, height: 800 } })

    test('landing', async ({ page }) => {
      await setLocale(page, code)
      await page.goto('/')
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await expect(page).toHaveScreenshot(`${code}-desktop-landing.png`, { fullPage: true })
    })

    test('accessibility', async ({ page }) => {
      await setLocale(page, code)
      await page.goto('/accessibility')
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await expect(page).toHaveScreenshot(`${code}-desktop-accessibility.png`, { fullPage: true })
    })

    for (const step of STEPS) {
      test(`wizard step ${step}`, async ({ page }) => {
        await setLocale(page, code)
        await page.goto(prefilledWizardUrl(step))
        await expect(page).toHaveURL(/step=/)
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
        if (step === 7) await waitForFonts(page)
        await expect(page).toHaveScreenshot(`${code}-desktop-wizard-step-${step}.png`, {
          fullPage: true,
          timeout: step === 7 ? 30_000 : 10_000,
        })
      })
    }
  })
}

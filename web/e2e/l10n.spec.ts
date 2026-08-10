import { expect, test, type Page } from '@playwright/test'

const LOCALES = ['he', 'en', 'es', 'fr'] as const

// Content pages exist in two URL forms: the bare Hebrew one (/, /accessibility)
// and the /en English one shared by en/es/fr. The URL form owns the language.
const FORMS = [
  { code: 'he', base: '/', lang: 'he', dir: 'rtl', landingH1: 'לעילוי נשמת הנפטר', a11yH1: 'הצהרת נגישות' },
  { code: 'en', base: '/en', lang: 'en', dir: 'ltr', landingH1: 'Create a printable yahrzeit sheet', a11yH1: 'Accessibility statement' },
] as const

function contentPath(form: (typeof FORMS)[number], route: string): string {
  return `${form.base === '/' ? '' : form.base}${route}`
}

const STEPS = [1, 2, 3, 4] as const

const NEXT_LABEL: Record<(typeof LOCALES)[number], string> = {
  he: 'הבא',
  en: 'Next',
  es: 'Siguiente',
  fr: 'Suivant',
}

function prefilledWizardUrl(step: number): string {
  const params = new URLSearchParams({
    step: String(step),
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

/** Step 4 renders the sheet preview with embedded data-URI fonts - wait for them. */
async function waitForFonts(page: Page): Promise<void> {
  await page.evaluate(() => document.fonts.ready.then(() => true))
}

// --- Content pages: the two URL forms ------------------------------------

for (const form of FORMS) {
  test.describe(`content form ${form.code}`, () => {
    test('app shell respects dir and lang', async ({ page }) => {
      await setLocale(page, form.code)
      await page.goto(form.base)
      await expect(page.locator('html')).toHaveAttribute('lang', form.lang)
      await expect(page.locator('html')).toHaveAttribute('dir', form.dir)
    })

    test('landing page renders', async ({ page }) => {
      await setLocale(page, form.code)
      await page.goto(form.base)
      // Assert the real hero copy, not "any h1" - a 404 fallback also has one.
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(form.landingH1)
    })

    test('accessibility page renders', async ({ page }) => {
      await setLocale(page, form.code)
      await page.goto(contentPath(form, '/accessibility'))
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(form.a11yH1)
    })
  })
}

// Landing and accessibility assert content, not pixels. Visual regression
// snapshots are reserved for the wizard below, where the sheet's print layout
// genuinely matters and every change is a deliberate design decision.

// --- Wizard: locale-neutral, the picker language drives the UI ------------

for (const code of LOCALES) {
  test.describe(`wizard ${code}`, () => {
    test('keeps keyboard-only navigation working', async ({ page }) => {
      await setLocale(page, code)
      await page.goto('/wizard')
      // Step forward with the keyboard alone: tab until the wizard's Next
      // button is focused (the header + picker precede it in tab order, so
      // the count is not fixed), then press Enter.
      const next = page.getByRole('button', { name: NEXT_LABEL[code], exact: true })
      for (let i = 0; i < 12; i++) {
        if (await next.evaluate((el) => el === document.activeElement)) break
        await page.keyboard.press('Tab')
      }
      await next.press('Enter')
      await expect(page).toHaveURL(/step=2/)
    })

    test.describe('snapshots mobile', () => {
      test.use({ viewport: { width: 375, height: 667 } })

      for (const step of STEPS) {
        test(`step ${step}`, async ({ page }) => {
          await setLocale(page, code)
          await page.goto(prefilledWizardUrl(step))
          await expect(page).toHaveURL(/step=/)
          await expect(page.locator('[data-step-heading]')).toBeVisible()
          if (step === 4) await waitForFonts(page)
          await expect(page).toHaveScreenshot(
            `${code}-mobile-wizard-step-${step}.png`,
            { fullPage: true, timeout: step === 4 ? 30_000 : 10_000 },
          )
        })
      }
    })

    test.describe('snapshots desktop', () => {
      test.use({ viewport: { width: 1280, height: 800 } })

      for (const step of STEPS) {
        test(`step ${step}`, async ({ page }) => {
          await setLocale(page, code)
          await page.goto(prefilledWizardUrl(step))
          await expect(page).toHaveURL(/step=/)
          await expect(page.locator('[data-step-heading]')).toBeVisible()
          if (step === 4) await waitForFonts(page)
          await expect(page).toHaveScreenshot(
            `${code}-desktop-wizard-step-${step}.png`,
            { fullPage: true, timeout: step === 4 ? 30_000 : 10_000 },
          )
        })
      }
    })
  })
}

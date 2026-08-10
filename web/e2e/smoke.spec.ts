import { expect, test, type Page } from '@playwright/test'

/** Tabs from the currently focused element until the "next step" button gets focus. */
async function tabToNextButton(page: Page): Promise<void> {
  const next = page.getByRole('button', { name: 'הבא' })
  for (let attempt = 0; attempt < 10; attempt += 1) {
    await page.keyboard.press('Tab')
    if (await next.evaluate((el) => el === document.activeElement)) return
  }
  throw new Error('Could not reach the next-step button via Tab')
}

test.describe('landing page', () => {
  test('renders Hebrew RTL shell with a11y widget', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/תפילה לנשמה/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'he')
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'לעילוי נשמת הנפטר',
    )
    await expect(page.getByRole('link', { name: 'התחילו כאן' })).toBeVisible()
    await expect(page.getByRole('button', { name: /נגישות/ })).toBeVisible()
  })

  test('opens the a11y widget with Alt+A and applies a preference', async ({ page }) => {
    await page.goto('/')
    // Wait for React to hydrate and attach the Alt+A keydown listener - the
    // widget button only renders after mount, so its visibility is a safe
    // "listener is live" signal.
    await expect(page.getByRole('button', { name: /נגישות/ })).toBeVisible()
    await page.keyboard.press('Alt+A')
    const dialog = page.getByRole('dialog', { name: 'העדפות נגישות' })
    await expect(dialog).toBeVisible()
    await dialog.getByRole('switch', { name: 'ניגודיות גבוהה' }).click()
    await expect(page.locator('html')).toHaveClass(/a11y-contrast/)
    await page.reload()
    await expect(page.locator('html')).toHaveClass(/a11y-contrast/)
  })
})

test.describe('wizard', () => {
  test('walks steps 1-3 with the keyboard, URL state follows', async ({ page }) => {
    await page.goto('/wizard')
    await expect(page).toHaveURL(/step=1/)
    // Each step keeps an sr-only focus heading (data-step-heading) that
    // receives focus on step change - the visible title in the footer bar is
    // a separate heading, so target the focus element explicitly.
    await expect(page.locator('[data-step-heading]')).toBeFocused()
    await expect(page.locator('[data-step-heading]')).toHaveText('מגדר')

    await tabToNextButton(page)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/step=2/)
    await expect(page.locator('[data-step-heading]')).toBeFocused()
    await expect(page.locator('[data-step-heading]')).toHaveText('נוסח')
    await page.waitForTimeout(250)

    // Step 2 (nusach) gates the Next button until a valid עדה selection is
    // made. Defaults land on Ashkenaz with no נוסח, which is invalid - pick
    // Mizrahi via the radio group to unlock Next.
    await page.keyboard.press('Tab')
    for (let attempt = 0; attempt < 15; attempt += 1) {
      if ((await page.evaluate(() => document.activeElement?.getAttribute('role'))) === 'radio') break
      await page.keyboard.press('Tab')
    }
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(150)
    await page.keyboard.press('Space')
    await expect(page).toHaveURL(/edah=mizrahi/)
    await expect(page.getByRole('button', { name: 'הבא' })).toBeEnabled()

    await tabToNextButton(page)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/step=3/)
    await expect(page.locator('[data-step-heading]')).toBeFocused()
    await expect(page.locator('[data-step-heading]')).toHaveText('שם')
  })

  test('clamps an out-of-range step in the URL', async ({ page }) => {
    await page.goto('/wizard?step=99')
    // Out-of-range steps clamp to STEP_MAX (5), the full-width editor step.
    await expect(page).toHaveURL(/step=5/)
    await expect(page.locator('[data-step="5"]')).toBeVisible()
  })
})

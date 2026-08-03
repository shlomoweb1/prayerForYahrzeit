import { expect, test } from '@playwright/test'

test.describe('landing page', () => {
  test('renders Hebrew RTL shell with a11y widget', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/יזכור/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'he')
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'יצירת דף יזכור להדפסה',
    )
    await expect(page.getByRole('link', { name: 'התחילו כאן' })).toBeVisible()
    await expect(page.getByRole('button', { name: /נגישות/ })).toBeVisible()
  })

  test('opens the a11y widget with Alt+A and applies a preference', async ({ page }) => {
    await page.goto('/')
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
    await expect(page.getByRole('heading', { name: 'מטרת הדף' })).toBeFocused()

    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/step=2/)
    await expect(page.getByRole('heading', { name: 'מגדר' })).toBeFocused()

    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/step=3/)
    await expect(page.getByRole('heading', { name: 'נוסח' })).toBeFocused()
  })

  test('clamps an out-of-range step in the URL', async ({ page }) => {
    await page.goto('/wizard?step=99')
    await expect(page.getByRole('heading', { name: 'סיכום' })).toBeVisible()
  })
})

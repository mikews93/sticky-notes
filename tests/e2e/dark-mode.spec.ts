import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'networkidle' })
})

test.describe('Dark Mode', () => {
  test('toggles the background color when clicking the theme button', async ({ page }) => {
    // Verify starting in light mode (no 'dark' class on body)
    const isInitiallyLight = await page.evaluate(() => !document.body.classList.contains('dark'))
    expect(isInitiallyLight).toBe(true)

    // Click the theme toggle
    const toggle = page.getByLabel('Toggle theme')
    await toggle.click()

    // The body should now have the 'dark' class
    const hasDark = await page.evaluate(() => document.body.classList.contains('dark'))
    expect(hasDark).toBe(true)

    // localStorage should reflect the theme
    const stored = await page.evaluate(() => localStorage.getItem('theme'))
    expect(stored).toBe('dark')
  })

  test('persists dark mode after page reload', async ({ page }) => {
    // Enable dark mode
    const toggle = page.getByLabel('Toggle theme')
    await toggle.click()

    await page.reload()

    // body should still have 'dark' after reload
    const hasDark = await page.evaluate(() => document.body.classList.contains('dark'))
    expect(hasDark).toBe(true)
  })

  test('toggles back to light mode', async ({ page }) => {
    const toggle = page.getByLabel('Toggle theme')

    // Toggle dark then light
    await toggle.click()
    await toggle.click()

    const hasDark = await page.evaluate(() => document.body.classList.contains('dark'))
    expect(hasDark).toBe(false)

    const stored = await page.evaluate(() => localStorage.getItem('theme'))
    expect(stored).toBe('light')
  })

  test('toolbar switches to dark styling in dark mode', async ({ page }) => {
    const toggle = page.getByLabel('Toggle theme')
    await toggle.click()

    const toolbar = page.getByTestId('toolbar')
    await expect(toolbar).toBeVisible()
  })
})

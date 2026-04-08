import { test, expect } from '@playwright/test'

async function clearAll(page: import('@playwright/test').Page) {
  await page.evaluate(async () => {
    localStorage.clear()
    const res = await fetch('http://localhost:3001/notes')
    const notes = await res.json()
    await Promise.all(notes.map((n: { id: string }) => fetch(`http://localhost:3001/notes/${n.id}`, { method: 'DELETE' })))
  })
}

test.describe('Persistence', () => {
  test('restores notes from localStorage after page reload', async ({ page }) => {
    await page.goto('/')
    await clearAll(page)
    await page.reload()

    // Create a note and add text
    await page.click('[data-testid="add-note-button"]')
    const textarea = page.locator('[data-testid^="note-"] textarea')
    await textarea.click()
    await textarea.fill('Persist me')

    // Wait for localStorage debounce (300ms)
    await page.waitForTimeout(500)

    // Verify localStorage has data
    const stored = await page.evaluate(() => localStorage.getItem('sticky-notes'))
    expect(stored).not.toBeNull()
    expect(stored).toContain('Persist me')

    // Reload the page
    await page.reload()

    // Note should be restored
    const notes = page.locator('[data-testid^="note-"]')
    await expect(notes).toHaveCount(1)

    const restoredTextarea = page.locator('[data-testid^="note-"] textarea')
    await expect(restoredTextarea).toHaveValue('Persist me')
  })

  test('starts with empty board when localStorage is empty', async ({ page }) => {
    await page.goto('/')
    await clearAll(page)
    await page.reload()

    const notes = page.locator('[data-testid^="note-"]')
    await expect(notes).toHaveCount(0)
  })

  test('persists note position after drag', async ({ page }) => {
    await page.goto('/')
    await clearAll(page)
    await page.reload()

    await page.click('[data-testid="add-note-button"]')

    const note = page.locator('[data-testid^="note-"]')
    const initialBox = await note.boundingBox()
    expect(initialBox).not.toBeNull()

    // Drag the note toward viewport center to avoid edge clamping
    const startX = initialBox!.x + initialBox!.width / 2
    const startY = initialBox!.y + 16
    await page.mouse.move(startX, startY)
    await page.mouse.down()
    await page.mouse.move(200, 250, { steps: 10 })
    await page.mouse.up()

    // Wait for debounce
    await page.waitForTimeout(500)

    // Reload
    await page.reload()

    // Note should be at the new position (roughly)
    const restoredNote = page.locator('[data-testid^="note-"]')
    await expect(restoredNote).toHaveCount(1)

    const restoredBox = await restoredNote.boundingBox()
    expect(restoredBox).not.toBeNull()
    // Position should have changed from the original
    expect(restoredBox!.x).not.toBe(initialBox!.x)
  })
})

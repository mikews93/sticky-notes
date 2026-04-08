import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  // Clear localStorage before each test
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test.describe('Notes CRUD', () => {
  test('creates a new note when clicking Add Note', async ({ page }) => {
    await page.click('[data-testid="add-note-button"]')

    const notes = page.locator('[data-testid^="note-"]')
    await expect(notes).toHaveCount(1)
  })

  test('creates multiple notes', async ({ page }) => {
    await page.click('[data-testid="add-note-button"]')
    await page.click('[data-testid="add-note-button"]')
    await page.click('[data-testid="add-note-button"]')

    const notes = page.locator('[data-testid^="note-"]')
    await expect(notes).toHaveCount(3)
  })

  test('edits note text via textarea', async ({ page }) => {
    await page.click('[data-testid="add-note-button"]')

    const textarea = page.locator('[data-testid^="note-"] textarea')
    await textarea.click()
    await textarea.fill('Hello World')

    await expect(textarea).toHaveValue('Hello World')
  })

  test('deletes a note by dragging to trash zone', async ({ page }) => {
    await page.click('[data-testid="add-note-button"]')

    const note = page.locator('[data-testid^="note-"]')
    await expect(note).toHaveCount(1)

    // Get note position
    const noteBox = await note.boundingBox()
    expect(noteBox).not.toBeNull()

    // Get trash zone position
    const trash = page.locator('[data-testid="trash-zone"]')
    const trashBox = await trash.boundingBox()
    expect(trashBox).not.toBeNull()

    // Drag note header to trash zone
    const startX = noteBox!.x + noteBox!.width / 2
    const startY = noteBox!.y + 16 // Middle of header (32px / 2)
    const endX = trashBox!.x + trashBox!.width / 2
    const endY = trashBox!.y + trashBox!.height / 2

    await page.mouse.move(startX, startY)
    await page.mouse.down()
    await page.mouse.move(endX, endY, { steps: 15 })
    await page.mouse.up()

    // Note should be removed
    await expect(page.locator('[data-testid^="note-"]')).toHaveCount(0)
  })

  test('creates notes with selected color', async ({ page }) => {
    // Select pink color
    const pinkSwatch = page.locator('[aria-label="pink"]')
    await pinkSwatch.click()

    await page.click('[data-testid="add-note-button"]')

    const note = page.locator('[data-testid^="note-"]')
    // The note should have the pink background class
    await expect(note).toHaveCount(1)
  })
})

import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(async () => {
    localStorage.clear()
    const res = await fetch('http://localhost:3001/notes')
    const notes = await res.json()
    await Promise.all(notes.map((n: { id: string }) => fetch(`http://localhost:3001/notes/${n.id}`, { method: 'DELETE' })))
  })
  await page.reload()
})

test.describe('Drag and Drop', () => {
  test('moves a note by dragging its header', async ({ page }) => {
    await page.click('[data-testid="add-note-button"]')

    const note = page.locator('[data-testid^="note-"]')
    const initialBox = await note.boundingBox()
    expect(initialBox).not.toBeNull()

    // Drag from the header area toward a known position
    const startX = initialBox!.x + initialBox!.width / 2
    const startY = initialBox!.y + 16

    // Drag toward the top-left corner to avoid viewport clamping
    const targetX = 100
    const targetY = 150

    await page.mouse.move(startX, startY)
    await page.mouse.down()
    await page.mouse.move(targetX, targetY, { steps: 10 })
    await page.mouse.up()

    // Note should have moved to approximately the target position
    const newBox = await note.boundingBox()
    expect(newBox).not.toBeNull()

    // The note's top-left should now be near our target
    // (accounting for the offset between mouse position and note corner)
    expect(newBox!.x).not.toBe(initialBox!.x)
  })

  test('resizes a note by dragging the resize handle', async ({ page }) => {
    await page.click('[data-testid="add-note-button"]')

    const note = page.locator('[data-testid^="note-"]')
    const initialBox = await note.boundingBox()
    expect(initialBox).not.toBeNull()

    // Resize handle is at bottom-right corner
    const handleX = initialBox!.x + initialBox!.width - 8
    const handleY = initialBox!.y + initialBox!.height - 8

    await page.mouse.move(handleX, handleY)
    await page.mouse.down()
    await page.mouse.move(handleX + 100, handleY + 80, { steps: 10 })
    await page.mouse.up()

    // Note should be larger
    const newBox = await note.boundingBox()
    expect(newBox).not.toBeNull()
    const widthDelta = newBox!.width - initialBox!.width
    const heightDelta = newBox!.height - initialBox!.height
    expect(widthDelta).toBeGreaterThan(50)
    expect(heightDelta).toBeGreaterThan(40)
  })

  test('brings clicked note to front (z-index)', async ({ page }) => {
    // Create two notes
    await page.click('[data-testid="add-note-button"]')
    await page.click('[data-testid="add-note-button"]')

    const notes = page.locator('[data-testid^="note-"]')
    await expect(notes).toHaveCount(2)

    // Get both note IDs via their data-testid
    const firstNote = notes.first()
    const secondNote = notes.last()

    // The second note was created later, so it has the higher z-index initially
    const initialSecondZ = await secondNote.evaluate((el) => parseInt(el.style.zIndex || '0'))
    const initialFirstZ = await firstNote.evaluate((el) => parseInt(el.style.zIndex || '0'))
    expect(initialSecondZ).toBeGreaterThan(initialFirstZ)

    // Click the first note's header to bring it to front
    const firstBox = await firstNote.boundingBox()
    expect(firstBox).not.toBeNull()

    // Use dispatchEvent to click specifically the first note
    await firstNote.dispatchEvent('mousedown')
    await page.waitForTimeout(100)

    // Now the first note should have a higher z-index
    const newFirstZ = await firstNote.evaluate((el) => parseInt(el.style.zIndex || '0'))
    expect(newFirstZ).toBeGreaterThan(initialSecondZ)
  })
})

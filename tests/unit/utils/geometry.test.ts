import { describe, it, expect } from 'vitest'
import { rectsOverlap, clampPosition } from '@/utils/geometry'

describe('rectsOverlap', () => {
  it('returns true for overlapping rects', () => {
    const a = { x: 0, y: 0, width: 100, height: 100 }
    const b = { x: 50, y: 50, width: 100, height: 100 }
    expect(rectsOverlap(a, b)).toBe(true)
  })

  it('returns true when one rect contains another', () => {
    const outer = { x: 0, y: 0, width: 200, height: 200 }
    const inner = { x: 50, y: 50, width: 50, height: 50 }
    expect(rectsOverlap(outer, inner)).toBe(true)
    expect(rectsOverlap(inner, outer)).toBe(true)
  })

  it('returns false for disjoint rects (horizontal)', () => {
    const a = { x: 0, y: 0, width: 50, height: 50 }
    const b = { x: 100, y: 0, width: 50, height: 50 }
    expect(rectsOverlap(a, b)).toBe(false)
  })

  it('returns false for disjoint rects (vertical)', () => {
    const a = { x: 0, y: 0, width: 50, height: 50 }
    const b = { x: 0, y: 100, width: 50, height: 50 }
    expect(rectsOverlap(a, b)).toBe(false)
  })

  it('returns false for adjacent rects (touching edges)', () => {
    const a = { x: 0, y: 0, width: 50, height: 50 }
    const b = { x: 50, y: 0, width: 50, height: 50 }
    expect(rectsOverlap(a, b)).toBe(false)
  })

  it('returns true for rects overlapping by 1px', () => {
    const a = { x: 0, y: 0, width: 51, height: 50 }
    const b = { x: 50, y: 0, width: 50, height: 50 }
    expect(rectsOverlap(a, b)).toBe(true)
  })
})

describe('clampPosition', () => {
  const boardSize = { width: 800, height: 600 }
  const noteSize = { width: 200, height: 180 }

  it('returns position unchanged when within bounds', () => {
    const pos = { x: 100, y: 100 }
    expect(clampPosition(pos, noteSize, boardSize)).toEqual({ x: 100, y: 100 })
  })

  it('clamps negative x to 0', () => {
    const pos = { x: -50, y: 100 }
    expect(clampPosition(pos, noteSize, boardSize)).toEqual({ x: 0, y: 100 })
  })

  it('clamps negative y to 0', () => {
    const pos = { x: 100, y: -50 }
    expect(clampPosition(pos, noteSize, boardSize)).toEqual({ x: 100, y: 0 })
  })

  it('clamps x so note does not exceed right edge', () => {
    const pos = { x: 700, y: 100 }
    expect(clampPosition(pos, noteSize, boardSize)).toEqual({ x: 600, y: 100 })
  })

  it('clamps y so note does not exceed bottom edge', () => {
    const pos = { x: 100, y: 500 }
    expect(clampPosition(pos, noteSize, boardSize)).toEqual({ x: 100, y: 420 })
  })

  it('clamps both axes simultaneously', () => {
    const pos = { x: -100, y: 900 }
    expect(clampPosition(pos, noteSize, boardSize)).toEqual({ x: 0, y: 420 })
  })

  it('handles note exactly fitting the board', () => {
    const pos = { x: 600, y: 420 }
    expect(clampPosition(pos, noteSize, boardSize)).toEqual({ x: 600, y: 420 })
  })
})

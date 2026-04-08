export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

/** Returns true if two rectangles overlap (AABB collision) */
export function rectsOverlap(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}

/** Clamps a position so the note stays within board bounds */
export function clampPosition(
  pos: { x: number; y: number },
  noteSize: { width: number; height: number },
  boardSize: { width: number; height: number },
): { x: number; y: number } {
  return {
    x: Math.max(0, Math.min(pos.x, boardSize.width - noteSize.width)),
    y: Math.max(0, Math.min(pos.y, boardSize.height - noteSize.height)),
  }
}

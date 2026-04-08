import { useRef, useLayoutEffect } from 'react'
import type { RefObject } from 'react'
import { rectsOverlap } from '@/utils/geometry'

interface UseTrashDetectionOptions {
  trashRef: RefObject<HTMLElement | null>
  noteRect: { x: number; y: number; width: number; height: number } | null
  isDragging: boolean
}

export function useTrashDetection({
  trashRef,
  noteRect,
  isDragging,
}: UseTrashDetectionOptions): { isOverTrash: boolean } {
  const isOverTrashRef = useRef(false)
  // Cache the trash zone rect at drag start — it doesn't move during drag
  const trashRectRef = useRef<DOMRect | null>(null)

  useLayoutEffect(() => {
    if (!isDragging || !noteRect) {
      isOverTrashRef.current = false
      trashRectRef.current = null
      return
    }

    // Cache trash rect on first frame of drag
    if (!trashRectRef.current && trashRef.current) {
      trashRectRef.current = trashRef.current.getBoundingClientRect()
    }

    if (!trashRectRef.current) return

    const over = rectsOverlap(noteRect, {
      x: trashRectRef.current.x,
      y: trashRectRef.current.y,
      width: trashRectRef.current.width,
      height: trashRectRef.current.height,
    })

    isOverTrashRef.current = over
  }, [isDragging, noteRect, trashRef])

  return { isOverTrash: isOverTrashRef.current }
}

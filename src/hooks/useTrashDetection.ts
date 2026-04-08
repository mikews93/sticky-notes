import { useMemo } from 'react'
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
  const isOverTrash = useMemo(() => {
    if (!isDragging || !noteRect || !trashRef.current) return false

    const trashRect = trashRef.current.getBoundingClientRect()

    return rectsOverlap(noteRect, {
      x: trashRect.x,
      y: trashRect.y,
      width: trashRect.width,
      height: trashRect.height,
    })
  }, [isDragging, noteRect, trashRef])

  return { isOverTrash }
}

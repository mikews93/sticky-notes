import { useState, useRef, useEffect, useCallback } from 'react'
import type { NoteSize } from '@/types'

import { MIN_NOTE_WIDTH, MIN_NOTE_HEIGHT } from '@/constants'

interface UseResizeOptions {
  initialSize: NoteSize
  onResizeEnd: (size: NoteSize) => void
}

interface UseResizeReturn {
  handleMouseDown: (e: React.MouseEvent) => void
  isResizing: boolean
  currentSize: NoteSize
}

export function useResize({ initialSize, onResizeEnd }: UseResizeOptions): UseResizeReturn {
  const [isResizing, setIsResizing] = useState(false)
  const [currentSize, setCurrentSize] = useState<NoteSize>(initialSize)

  const resizeState = useRef({
    startX: 0,
    startY: 0,
    initialWidth: 0,
    initialHeight: 0,
  })
  const isResizingRef = useRef(false)
  const onResizeEndRef = useRef(onResizeEnd)

  useEffect(() => {
    onResizeEndRef.current = onResizeEnd
  }, [onResizeEnd])

  // Sync size from parent when not resizing
  useEffect(() => {
    if (!isResizingRef.current) {
      setCurrentSize(initialSize)
    }
  }, [initialSize])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return

      const deltaX = e.clientX - resizeState.current.startX
      const deltaY = e.clientY - resizeState.current.startY

      setCurrentSize({
        width: Math.max(MIN_NOTE_WIDTH, resizeState.current.initialWidth + deltaX),
        height: Math.max(MIN_NOTE_HEIGHT, resizeState.current.initialHeight + deltaY),
      })
    }

    const handleMouseUp = () => {
      if (!isResizingRef.current) return

      isResizingRef.current = false
      setIsResizing(false)

      setCurrentSize((size) => {
        queueMicrotask(() => onResizeEndRef.current(size))
        return size
      })
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return
      e.preventDefault()
      e.stopPropagation() // Prevent triggering note drag

      resizeState.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialWidth: currentSize.width,
        initialHeight: currentSize.height,
      }

      isResizingRef.current = true
      setIsResizing(true)
    },
    [currentSize],
  )

  return { handleMouseDown, isResizing, currentSize }
}

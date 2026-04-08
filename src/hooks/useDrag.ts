import { useState, useRef, useEffect, useCallback } from 'react'
import type { NotePosition } from '@/types'

interface UseDragOptions {
  initialPosition: NotePosition
  onDragEnd: (position: NotePosition) => void
  onDragStart?: () => void
}

interface UseDragReturn {
  handleMouseDown: (e: React.MouseEvent) => void
  isDragging: boolean
  currentPosition: NotePosition
}

export function useDrag({ initialPosition, onDragEnd, onDragStart }: UseDragOptions): UseDragReturn {
  const [isDragging, setIsDragging] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<NotePosition>(initialPosition)

  // Mutable refs to avoid stale closures in document listeners
  const dragState = useRef({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  })
  const isDraggingRef = useRef(false)
  const currentPositionRef = useRef(currentPosition)
  const onDragEndRef = useRef(onDragEnd)
  const onDragStartRef = useRef(onDragStart)

  // Keep refs in sync
  useEffect(() => {
    onDragEndRef.current = onDragEnd
  }, [onDragEnd])

  useEffect(() => {
    onDragStartRef.current = onDragStart
  }, [onDragStart])

  // Sync position from parent when not dragging
  useEffect(() => {
    if (!isDraggingRef.current) {
      setCurrentPosition(initialPosition)
      currentPositionRef.current = initialPosition
    }
  }, [initialPosition])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return

      const deltaX = e.clientX - dragState.current.startX
      const deltaY = e.clientY - dragState.current.startY

      const newPos = {
        x: dragState.current.initialX + deltaX,
        y: dragState.current.initialY + deltaY,
      }
      currentPositionRef.current = newPos
      setCurrentPosition(newPos)
    }

    const handleMouseUp = () => {
      if (!isDraggingRef.current) return

      isDraggingRef.current = false
      setIsDragging(false)

      // Read the latest position from the ref-tracked state
      // and call onDragEnd after the state update
      setCurrentPosition((pos) => {
        onDragEndRef.current(pos)
        return pos
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
      // Only respond to left mouse button
      if (e.button !== 0) return
      e.preventDefault()

      dragState.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialX: currentPositionRef.current.x,
        initialY: currentPositionRef.current.y,
      }

      isDraggingRef.current = true
      setIsDragging(true)

      // Defer onDragStart to avoid updating parent state during child render
      queueMicrotask(() => onDragStartRef.current?.())
    },
    [],
  )

  return { handleMouseDown, isDragging, currentPosition }
}

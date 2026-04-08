import { useState, useRef, useEffect, useCallback } from 'react'
import type { NotePosition, NoteSize } from '@/types'
import { clampPosition } from '@/utils/geometry'

interface UseDragOptions {
  initialPosition: NotePosition
  onDragEnd: (position: NotePosition) => void
  onDragStart?: () => void
  bounds?: {
    noteSize: NoteSize
    boardSize?: { width: number; height: number }
  }
}

interface UseDragReturn {
  handleMouseDown: (e: React.MouseEvent) => void
  isDragging: boolean
  currentPosition: NotePosition
}

export function useDrag({ initialPosition, onDragEnd, onDragStart, bounds }: UseDragOptions): UseDragReturn {
  const [isDragging, setIsDragging] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<NotePosition>(initialPosition)

  const isDraggingRef = useRef(false)
  const currentPositionRef = useRef(initialPosition)
  const onDragEndRef = useRef(onDragEnd)
  const onDragStartRef = useRef(onDragStart)
  const boundsRef = useRef(bounds)
  const dragState = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 })

  // Keep refs up to date
  useEffect(() => {
    onDragEndRef.current = onDragEnd
    onDragStartRef.current = onDragStart
    boundsRef.current = bounds
  }, [onDragEnd, onDragStart, bounds])

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

      let newPos = {
        x: dragState.current.initialX + deltaX,
        y: dragState.current.initialY + deltaY,
      }

      const activeBounds = boundsRef.current
      if (activeBounds) {
        newPos = clampPosition(
          newPos,
          activeBounds.noteSize,
          activeBounds.boardSize || { width: window.innerWidth, height: window.innerHeight }
        )
      }

      currentPositionRef.current = newPos
      setCurrentPosition(newPos)
    }

    const handleMouseUp = () => {
      if (!isDraggingRef.current) return

      isDraggingRef.current = false
      setIsDragging(false)

      // Use the ref to get the latest position and trigger the cleanup
      onDragEndRef.current(currentPositionRef.current)
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

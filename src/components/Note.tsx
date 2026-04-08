import { memo, useRef, useCallback } from 'react'
import type { RefObject } from 'react'
import type { Note as NoteType, NoteColour, NotePosition, NoteSize } from '@/types'
import { cn } from '@/lib/utils'
import { useDrag } from '@/hooks/useDrag'
import { useResize } from '@/hooks/useResize'
import { useTrashDetection } from '@/hooks/useTrashDetection'
import { ResizeHandle } from './ResizeHandle'

const COLOUR_CLASSES: Record<NoteColour, { bg: string; header: string; borderDark: string }> = {
  yellow: { bg: 'bg-[var(--note-yellow)]', header: 'bg-[var(--note-yellow-dark)]', borderDark: 'dark:border-[var(--note-yellow-dark)]' },
  pink: { bg: 'bg-[var(--note-pink)]', header: 'bg-[var(--note-pink-dark)]', borderDark: 'dark:border-[var(--note-pink-dark)]' },
  blue: { bg: 'bg-[var(--note-blue)]', header: 'bg-[var(--note-blue-dark)]', borderDark: 'dark:border-[var(--note-blue-dark)]' },
  green: { bg: 'bg-[var(--note-green)]', header: 'bg-[var(--note-green-dark)]', borderDark: 'dark:border-[var(--note-green-dark)]' },
  orange: { bg: 'bg-[var(--note-orange)]', header: 'bg-[var(--note-orange-dark)]', borderDark: 'dark:border-[var(--note-orange-dark)]' },
}

interface NoteProps {
  note: NoteType
  trashRef: RefObject<HTMLElement | null>
  onMove: (id: string, position: NotePosition) => void
  onResize: (id: string, size: NoteSize) => void
  onDelete: (id: string) => void
  onEditText: (id: string, text: string) => void
  onBringToFront: (id: string) => void
  onDragStateChange: (noteId: string, isDragging: boolean) => void
}

export const Note = memo(function Note({
  note,
  trashRef,
  onMove,
  onResize,
  onDelete,
  onEditText,
  onBringToFront,
  onDragStateChange,
}: NoteProps) {
  /** State */
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isOverTrashRef = useRef(false)

  /** Handlers */
  const handleDragEnd = useCallback(
    (position: NotePosition) => {
      onDragStateChange(note.id, false)
      if (isOverTrashRef.current) {
        onDelete(note.id)
      } else {
        onMove(note.id, position)
      }
    },
    [note.id, onMove, onDelete, onDragStateChange],
  )

  const handleDragStart = useCallback(() => {
    onDragStateChange(note.id, true)
    queueMicrotask(() => onBringToFront(note.id))
    textareaRef.current?.blur()
  }, [note.id, onBringToFront, onDragStateChange])

  const handleResizeEnd = useCallback(
    (size: NoteSize) => {
      onResize(note.id, size)
    },
    [note.id, onResize],
  )

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onEditText(note.id, e.target.value)
    },
    [note.id, onEditText],
  )

  const handleNoteMouseDown = useCallback(() => {
    queueMicrotask(() => onBringToFront(note.id))
  }, [note.id, onBringToFront])

  /** Hooks */
  const { handleMouseDown: handleDragMouseDown, isDragging, currentPosition } = useDrag({
    initialPosition: note.position,
    onDragEnd: handleDragEnd,
    onDragStart: handleDragStart,
  })

  const { handleMouseDown: handleResizeMouseDown, isResizing, currentSize } = useResize({
    initialSize: note.size,
    onResizeEnd: handleResizeEnd,
  })

  const noteRect = isDragging
    ? {
        x: currentPosition.x,
        y: currentPosition.y,
        width: currentSize.width,
        height: currentSize.height,
      }
    : null

  const { isOverTrash } = useTrashDetection({
    trashRef,
    noteRect,
    isDragging,
  })

  // Keep ref in sync for drag end handler
  isOverTrashRef.current = isOverTrash

  const colours = COLOUR_CLASSES[note.colour]

  /** Rendering */
  return (
    <div
      role="article"
      aria-label={`Sticky note: ${note.text.slice(0, 30) || 'empty'}`}
      data-testid={`note-${note.id}`}
      onMouseDown={handleNoteMouseDown}
      className={cn(
        'absolute rounded-xl overflow-hidden flex flex-col group',
        'animate-pop-in border border-white/20 dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-xs',
        'transition-[transform,opacity,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]',
        colours.bg,
        colours.borderDark,
        isDragging && 'scale-[1.05] rotate-2 duration-150!',
        isDragging && !isOverTrash && 'shadow-(--shadow-note-dragging) z-9999',
        isDragging && isOverTrash && 'shadow-(--shadow-note-dragging) border-2 border-red-500/50 opacity-60 scale-[0.9]',
        !isDragging && !isResizing && 'shadow-(--shadow-note) hover:shadow-(--shadow-note-hover) hover:-translate-y-1',
        isResizing && 'shadow-(--shadow-note-dragging)',
      )}
      style={{
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        width: `${currentSize.width}px`,
        height: `${currentSize.height}px`,
        zIndex: isDragging ? 9999 : note.zIndex,
        userSelect: isDragging ? 'none' : undefined,
      }}
    >
      {/* Header — drag handle */}
      <div
        role="button"
        aria-label="Drag to move note"
        onMouseDown={handleDragMouseDown}
        className={cn(
          'h-8 flex items-center justify-center shrink-0',
          'cursor-grab active:cursor-grabbing',
          colours.header,
        )}
      >
        <div className="flex gap-1 opacity-40">
          <div className="w-1 h-1 rounded-full bg-gray-600/40 dark:bg-gray-900/40" />
          <div className="w-1 h-1 rounded-full bg-gray-600/40 dark:bg-gray-900/40" />
          <div className="w-1 h-1 rounded-full bg-gray-600/40 dark:bg-gray-900/40" />
          <div className="w-1 h-1 rounded-full bg-gray-600/40 dark:bg-gray-900/40" />
          <div className="w-1 h-1 rounded-full bg-gray-600/40 dark:bg-gray-900/40" />
        </div>
      </div>

      {/* Body — editable textarea */}
      <textarea
        ref={textareaRef}
        aria-label="Note text"
        value={note.text}
        onChange={handleTextChange}
        placeholder="Type your note..."
        className={cn(
          'flex-1 w-full px-5 py-4 text-sm text-gray-800 dark:text-gray-100 leading-relaxed',
          'bg-transparent border-none outline-none resize-none',
          'placeholder:text-gray-500/80 dark:placeholder:text-gray-400/80',
          isDragging && 'pointer-events-none',
        )}
      />

      {/* Resize handle */}
      <ResizeHandle onMouseDown={handleResizeMouseDown} />
    </div>
  )
})

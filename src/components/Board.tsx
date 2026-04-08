import { memo } from 'react'
import type { RefObject } from 'react'
import type { Note as NoteType, NotePosition, NoteSize } from '@/types'
import { Note } from './Note'

interface BoardProps {
  notes: NoteType[]
  trashRef: RefObject<HTMLElement | null>
  onMove: (id: string, position: NotePosition) => void
  onResize: (id: string, size: NoteSize) => void
  onDelete: (id: string) => void
  onEditText: (id: string, text: string) => void
  onBringToFront: (id: string) => void
  onDragStateChange: (noteId: string, isDragging: boolean) => void
}

export const Board = memo(function Board({
  notes,
  trashRef,
  onMove,
  onResize,
  onDelete,
  onEditText,
  onBringToFront,
  onDragStateChange,
}: BoardProps) {
  return (
    <div
      data-testid="board"
      className="relative w-full h-full"
      style={{
        backgroundImage: 'radial-gradient(circle, var(--dot-color) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {notes.map((note) => (
        <Note
          key={note.id}
          note={note}
          trashRef={trashRef}
          onMove={onMove}
          onResize={onResize}
          onDelete={onDelete}
          onEditText={onEditText}
          onBringToFront={onBringToFront}
          onDragStateChange={onDragStateChange}
        />
      ))}
    </div>
  )
})

import { describe, it, expect, vi } from 'vitest'
import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { Board } from '@/components/Board'
import type { Note } from '@/types'

// Mock the Note component to isolate Board tests
vi.mock('@/components/Note', () => ({
  Note: ({ note }: { note: Note }) => (
    <div data-testid={`note-${note.id}`}>{note.text}</div>
  ),
}))

const makeNote = (overrides: Partial<Note> = {}): Note => ({
  id: 'note-1',
  position: { x: 100, y: 100 },
  size: { width: 200, height: 180 },
  colour: 'yellow',
  text: 'Test note',
  zIndex: 1,
  createdAt: 1000,
  updatedAt: 1000,
  ...overrides,
})

function renderBoard(notes: Note[] = []) {
  const trashRef = createRef<HTMLElement>()
  const props = {
    notes,
    trashRef,
    onMove: vi.fn(),
    onResize: vi.fn(),
    onDelete: vi.fn(),
    onEditText: vi.fn(),
    onBringToFront: vi.fn(),
    onDragStateChange: vi.fn(),
  }
  return { ...render(<Board {...props} />), props }
}

describe('Board', () => {
  it('renders the board container', () => {
    renderBoard()
    expect(screen.getByTestId('board')).toBeInTheDocument()
  })

  it('renders nothing when there are no notes', () => {
    renderBoard([])
    const notes = screen.queryAllByTestId(/^note-/)
    expect(notes).toHaveLength(0)
  })

  it('renders one Note per item in the notes array', () => {
    const notes = [
      makeNote({ id: 'a' }),
      makeNote({ id: 'b' }),
      makeNote({ id: 'c' }),
    ]
    renderBoard(notes)
    expect(screen.getByTestId('note-a')).toBeInTheDocument()
    expect(screen.getByTestId('note-b')).toBeInTheDocument()
    expect(screen.getByTestId('note-c')).toBeInTheDocument()
  })

  it('passes note text to children', () => {
    renderBoard([makeNote({ id: 'x', text: 'Hello Board' })])
    expect(screen.getByText('Hello Board')).toBeInTheDocument()
  })
})

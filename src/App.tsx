import { useState, useRef, useCallback, useEffect } from 'react'
import type { NoteColour } from '@/types'
import { DEFAULT_NOTE_WIDTH, DEFAULT_NOTE_HEIGHT } from '@/constants'
import { useNotes } from '@/hooks/useNotes'
import { Toolbar } from '@/components/Toolbar'
import { Board } from '@/components/Board'
import { TrashZone } from '@/components/TrashZone'

function randomOffset(): number {
  return Math.floor(Math.random() * 60) - 30
}

export default function App() {
  /** State */
  const [selectedColour, setSelectedColour] = useState<NoteColour>('yellow')
  const [draggingNoteId, setDraggingNoteId] = useState<string | null>(null)
  const trashRef = useRef<HTMLDivElement>(null)

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  // Theme Sync
  useEffect(() => {
    const body = document.body
    if (isDarkMode) {
      body.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      body.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  /** Hooks */
  const {
    notes,
    addNote,
    removeNote,
    moveNote,
    resizeNote,
    updateText,
    bringToFront,
  } = useNotes()

  /** Handlers */
  const handleAddNote = useCallback(() => {
    const centerX = Math.round(window.innerWidth / 2 - DEFAULT_NOTE_WIDTH / 2)
    const centerY = Math.round(window.innerHeight / 2 - DEFAULT_NOTE_HEIGHT / 2)
    const position = {
      x: centerX + randomOffset(),
      y: centerY + randomOffset(),
    }
    addNote(position, { width: DEFAULT_NOTE_WIDTH, height: DEFAULT_NOTE_HEIGHT }, selectedColour)
  }, [addNote, selectedColour])

  const handleDragStateChange = useCallback((noteId: string, isDragging: boolean) => {
    setDraggingNoteId(isDragging ? noteId : null)
  }, [])

  /** Rendering */
  return (
    <div className="w-full h-screen overflow-hidden bg-gray-50 dark:bg-[#0a0a0c] text-gray-900 dark:text-gray-100 transition-colors duration-300 relative">
      <Toolbar
        selectedColour={selectedColour}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((d) => !d)}
        onColourChange={setSelectedColour}
        onAddNote={handleAddNote}
      />

      <Board
        notes={notes}
        trashRef={trashRef}
        onMove={moveNote}
        onResize={resizeNote}
        onDelete={removeNote}
        onEditText={updateText}
        onBringToFront={bringToFront}
        onDragStateChange={handleDragStateChange}
      />

      <TrashZone ref={trashRef} isActive={draggingNoteId !== null} />
    </div>
  )
}

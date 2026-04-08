import type { NoteColour } from '@/types'
import { ColorPicker } from './ColorPicker'

interface ToolbarProps {
  selectedColour: NoteColour
  onColourChange: (colour: NoteColour) => void
  onAddNote: () => void
}

export function Toolbar({ selectedColour, onColourChange, onAddNote }: ToolbarProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 h-(--toolbar-height) bg-white/90 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-6"
      data-testid="toolbar"
    >
      <h1 className="text-lg font-semibold text-gray-800 tracking-tight">
        Sticky Notes
      </h1>

      <ColorPicker
        selectedColour={selectedColour}
        onColourChange={onColourChange}
      />

      <button
        type="button"
        onClick={onAddNote}
        data-testid="add-note-button"
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 text-white font-medium text-sm hover:bg-amber-600 active:bg-amber-700 transition-colors cursor-pointer shadow-sm"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="8" y1="2" x2="8" y2="14" />
          <line x1="2" y1="8" x2="14" y2="8" />
        </svg>
        Add Note
      </button>
    </header>
  )
}

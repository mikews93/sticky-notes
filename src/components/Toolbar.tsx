import type { NoteColour } from '@/types'
import { ColorPicker } from './ColorPicker'

interface ToolbarProps {
  selectedColour: NoteColour
  isDarkMode: boolean
  onToggleDarkMode: () => void
  onColourChange: (colour: NoteColour) => void
  onAddNote: () => void
}

export function Toolbar({ selectedColour, isDarkMode, onToggleDarkMode, onColourChange, onAddNote }: ToolbarProps) {
  return (
    <header
      className="fixed top-8 left-1/2 -translate-x-1/2 z-40 bg-white/70 dark:bg-black/50 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl rounded-full flex items-center justify-between px-8 py-3 w-max gap-8 transition-[box-shadow,background-color,border-color] duration-300 hover:shadow-2xl"
      style={!isDarkMode ? { boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)' } : undefined}
      data-testid="toolbar"
    >
      <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight drop-shadow-sm flex items-center shrink-0">
        Stick 'Em Up
      </h1>

      <ColorPicker
        selectedColour={selectedColour}
        onColourChange={onColourChange}
      />

      <div className="w-px h-8 bg-gray-300/60 dark:bg-gray-700/60 shrink-0" aria-hidden="true" />

      <div className="flex items-center gap-4 shrink-0">
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm cursor-pointer"
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={onAddNote}
          data-testid="add-note-button"
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-sm tracking-wide hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg cursor-pointer shrink-0"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="8" y1="2" x2="8" y2="14" />
            <line x1="2" y1="8" x2="14" y2="8" />
          </svg>
          New
        </button>
      </div>
    </header>
  )
}


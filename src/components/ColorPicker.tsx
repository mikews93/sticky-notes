import type { NoteColour } from '@/types'
import { cn } from '@/lib/utils'

const COLOURS: { value: NoteColour; bg: string }[] = [
  { value: 'yellow', bg: 'bg-[var(--note-yellow)] dark:bg-[var(--note-yellow-dark)]' },
  { value: 'pink', bg: 'bg-[var(--note-pink)] dark:bg-[var(--note-pink-dark)]' },
  { value: 'blue', bg: 'bg-[var(--note-blue)] dark:bg-[var(--note-blue-dark)]' },
  { value: 'green', bg: 'bg-[var(--note-green)] dark:bg-[var(--note-green-dark)]' },
  { value: 'orange', bg: 'bg-[var(--note-orange)] dark:bg-[var(--note-orange-dark)]' },
]

interface ColorPickerProps {
  selectedColour: NoteColour
  onColourChange: (colour: NoteColour) => void
}

export function ColorPicker({ selectedColour, onColourChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-3" role="radiogroup" aria-label="Note color">
      {COLOURS.map(({ value, bg }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={selectedColour === value}
          aria-label={value}
          onClick={() => onColourChange(value)}
          className={cn(
            'w-6 h-6 rounded-full border transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] cursor-pointer',
            'hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            bg,
            selectedColour === value
              ? 'border-gray-800 dark:border-white ring-2 ring-gray-800 dark:ring-white ring-offset-2 scale-125 shadow-sm'
              : 'border-black/10 dark:border-white/20 shadow-sm opacity-80 hover:opacity-100',
          )}
        />
      ))}
    </div>
  )
}

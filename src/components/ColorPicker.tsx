import type { NoteColour } from '@/types'
import { cn } from '@/lib/utils'

const COLOURS: { value: NoteColour; bg: string }[] = [
  { value: 'yellow', bg: 'bg-[var(--note-yellow)]' },
  { value: 'pink', bg: 'bg-[var(--note-pink)]' },
  { value: 'blue', bg: 'bg-[var(--note-blue)]' },
  { value: 'green', bg: 'bg-[var(--note-green)]' },
  { value: 'orange', bg: 'bg-[var(--note-orange)]' },
]

interface ColorPickerProps {
  selectedColour: NoteColour
  onColourChange: (colour: NoteColour) => void
}

export function ColorPicker({ selectedColour, onColourChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label="Note color">
      {COLOURS.map(({ value, bg }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={selectedColour === value}
          aria-label={value}
          onClick={() => onColourChange(value)}
          className={cn(
            'w-7 h-7 rounded-full border-2 transition-all duration-150 cursor-pointer',
            'hover:scale-110',
            bg,
            selectedColour === value
              ? 'border-gray-600 ring-2 ring-gray-300 scale-110'
              : 'border-gray-300',
          )}
        />
      ))}
    </div>
  )
}

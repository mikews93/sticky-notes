import { describe, it, expect, vi } from 'vitest'
import { notesReducer } from '@/hooks/useNotes'
import type { Note } from '@/types'

vi.mock('@/utils/ids', () => ({
  generateId: () => 'mock-id-123',
}))

const baseNote: Note = {
  id: 'note-1',
  position: { x: 100, y: 150 },
  size: { width: 200, height: 180 },
  colour: 'yellow',
  text: 'Hello',
  zIndex: 1,
  createdAt: 1000,
  updatedAt: 1000,
}

const secondNote: Note = {
  ...baseNote,
  id: 'note-2',
  position: { x: 300, y: 200 },
  zIndex: 2,
}

describe('notesReducer', () => {
  describe('ADD_NOTE', () => {
    it('adds a new note to the state', () => {
      const result = notesReducer([], {
        type: 'ADD_NOTE',
        payload: {
          position: { x: 100, y: 100 },
          size: { width: 200, height: 180 },
          colour: 'pink',
        },
      })

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('mock-id-123')
      expect(result[0].colour).toBe('pink')
      expect(result[0].text).toBe('')
      expect(result[0].zIndex).toBe(1)
    })

    it('assigns z-index higher than existing notes', () => {
      const result = notesReducer([baseNote, secondNote], {
        type: 'ADD_NOTE',
        payload: {
          position: { x: 0, y: 0 },
          size: { width: 200, height: 180 },
          colour: 'blue',
        },
      })

      expect(result[2].zIndex).toBe(3)
    })
  })

  describe('REMOVE_NOTE', () => {
    it('removes the note with matching id', () => {
      const result = notesReducer([baseNote, secondNote], {
        type: 'REMOVE_NOTE',
        payload: { id: 'note-1' },
      })

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('note-2')
    })

    it('returns unchanged state when id not found', () => {
      const state = [baseNote]
      const result = notesReducer(state, {
        type: 'REMOVE_NOTE',
        payload: { id: 'nonexistent' },
      })

      expect(result).toHaveLength(1)
    })
  })

  describe('MOVE_NOTE', () => {
    it('updates position of the matching note', () => {
      const result = notesReducer([baseNote], {
        type: 'MOVE_NOTE',
        payload: { id: 'note-1', position: { x: 500, y: 300 } },
      })

      expect(result[0].position).toEqual({ x: 500, y: 300 })
    })

    it('does not modify other notes', () => {
      const result = notesReducer([baseNote, secondNote], {
        type: 'MOVE_NOTE',
        payload: { id: 'note-1', position: { x: 0, y: 0 } },
      })

      expect(result[1].position).toEqual(secondNote.position)
    })
  })

  describe('RESIZE_NOTE', () => {
    it('updates size of the matching note', () => {
      const result = notesReducer([baseNote], {
        type: 'RESIZE_NOTE',
        payload: { id: 'note-1', size: { width: 300, height: 250 } },
      })

      expect(result[0].size).toEqual({ width: 300, height: 250 })
    })

    it('clamps to minimum width', () => {
      const result = notesReducer([baseNote], {
        type: 'RESIZE_NOTE',
        payload: { id: 'note-1', size: { width: 50, height: 200 } },
      })

      expect(result[0].size.width).toBe(120)
    })

    it('clamps to minimum height', () => {
      const result = notesReducer([baseNote], {
        type: 'RESIZE_NOTE',
        payload: { id: 'note-1', size: { width: 200, height: 30 } },
      })

      expect(result[0].size.height).toBe(80)
    })
  })

  describe('UPDATE_TEXT', () => {
    it('updates text of the matching note', () => {
      const result = notesReducer([baseNote], {
        type: 'UPDATE_TEXT',
        payload: { id: 'note-1', text: 'Updated text' },
      })

      expect(result[0].text).toBe('Updated text')
    })
  })

  describe('BRING_TO_FRONT', () => {
    it('sets z-index to max + 1', () => {
      const result = notesReducer([baseNote, secondNote], {
        type: 'BRING_TO_FRONT',
        payload: { id: 'note-1' },
      })

      expect(result[0].zIndex).toBe(3)
      expect(result[1].zIndex).toBe(2)
    })
  })

  describe('SET_NOTES', () => {
    it('replaces entire state', () => {
      const newNotes = [secondNote]
      const result = notesReducer([baseNote], {
        type: 'SET_NOTES',
        payload: newNotes,
      })

      expect(result).toEqual(newNotes)
    })
  })
})

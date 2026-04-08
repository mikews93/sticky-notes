import { useReducer, useEffect, useRef, useCallback } from 'react'
import type { Note, NotesAction, NotePosition, NoteSize, NoteColour } from '@/types'
import { generateId } from '@/utils/ids'
import { notesApi } from '@/api/notesApi'

const STORAGE_KEY = 'sticky-notes'
const STORAGE_DEBOUNCE = 300
const API_DEBOUNCE = 1000

import { MIN_NOTE_WIDTH, MIN_NOTE_HEIGHT } from '@/constants'

/** Pure reducer — exported for direct unit testing */
export function notesReducer(state: Note[], action: NotesAction): Note[] {
  const now = Date.now()

  switch (action.type) {
    case 'ADD_NOTE': {
      const maxZ = state.reduce((max, n) => Math.max(max, n.zIndex), 0)
      const newNote: Note = {
        id: generateId(),
        position: action.payload.position,
        size: action.payload.size,
        colour: action.payload.colour,
        text: '',
        zIndex: maxZ + 1,
        createdAt: now,
        updatedAt: now,
      }
      return [...state, newNote]
    }

    case 'REMOVE_NOTE':
      return state.filter((n) => n.id !== action.payload.id)

    case 'MOVE_NOTE':
      return state.map((n) =>
        n.id === action.payload.id
          ? { ...n, position: action.payload.position, updatedAt: now }
          : n,
      )

    case 'RESIZE_NOTE': {
      const { width, height } = action.payload.size
      return state.map((n) =>
        n.id === action.payload.id
          ? {
              ...n,
              size: {
                width: Math.max(MIN_NOTE_WIDTH, width),
                height: Math.max(MIN_NOTE_HEIGHT, height),
              },
              updatedAt: now,
            }
          : n,
      )
    }

    case 'UPDATE_TEXT':
      return state.map((n) =>
        n.id === action.payload.id
          ? { ...n, text: action.payload.text, updatedAt: now }
          : n,
      )

    case 'BRING_TO_FRONT': {
      const maxZ = state.reduce((max, n) => Math.max(max, n.zIndex), 0)
      return state.map((n) =>
        n.id === action.payload.id ? { ...n, zIndex: maxZ + 1 } : n,
      )
    }

    case 'SET_NOTES':
      return action.payload

    default:
      return state
  }
}

function loadFromStorage(): Note[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useNotes() {
  const [notes, dispatch] = useReducer(notesReducer, null, () => loadFromStorage())
  const storageTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const apiTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const isInitialMount = useRef(true)
  const dirtyNoteIds = useRef<Set<string>>(new Set())

  // Hydrate from API on mount
  useEffect(() => {
    notesApi.getAll().then((res) => {
      if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
        dispatch({ type: 'SET_NOTES', payload: res.data })
      }
    })
  }, [])

  // Persist to localStorage (debounced)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    clearTimeout(storageTimer.current)
    storageTimer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
      } catch {
        console.warn('Failed to persist notes to localStorage')
      }
    }, STORAGE_DEBOUNCE)

    return () => clearTimeout(storageTimer.current)
  }, [notes])

  // Sync to API (debounced, fire-and-forget — only dirty notes)
  useEffect(() => {
    if (isInitialMount.current) return

    clearTimeout(apiTimer.current)
    apiTimer.current = setTimeout(() => {
      const dirty = dirtyNoteIds.current
      if (dirty.size === 0) return

      const syncAll = dirty.has('__all__')
      const dirtyNotes = syncAll ? notes : notes.filter((n) => dirty.has(n.id))
      dirty.clear()

      dirtyNotes.forEach((note) => {
        notesApi.update(note).catch(() => {})
      })
    }, API_DEBOUNCE)

    return () => clearTimeout(apiTimer.current)
  }, [notes])

  const addNote = useCallback(
    (position: NotePosition, size: NoteSize, colour: NoteColour) => {
      dispatch({ type: 'ADD_NOTE', payload: { position, size, colour } })
      // ID is generated inside reducer; mark all as dirty so the new note syncs
      dirtyNoteIds.current.add('__all__')
    },
    [],
  )

  const removeNote = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTE', payload: { id } })
    dirtyNoteIds.current.delete(id)
    notesApi.remove(id).catch(() => {})
  }, [])

  const moveNote = useCallback((id: string, position: NotePosition) => {
    dispatch({ type: 'MOVE_NOTE', payload: { id, position } })
    dirtyNoteIds.current.add(id)
  }, [])

  const resizeNote = useCallback((id: string, size: NoteSize) => {
    dispatch({ type: 'RESIZE_NOTE', payload: { id, size } })
    dirtyNoteIds.current.add(id)
  }, [])

  const updateText = useCallback((id: string, text: string) => {
    dispatch({ type: 'UPDATE_TEXT', payload: { id, text } })
    dirtyNoteIds.current.add(id)
  }, [])

  const bringToFront = useCallback((id: string) => {
    dispatch({ type: 'BRING_TO_FRONT', payload: { id } })
    dirtyNoteIds.current.add(id)
  }, [])

  return { notes, addNote, removeNote, moveNote, resizeNote, updateText, bringToFront }
}

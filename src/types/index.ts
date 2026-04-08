export type NoteColour = 'yellow' | 'pink' | 'blue' | 'green' | 'orange'

export interface NotePosition {
  x: number
  y: number
}

export interface NoteSize {
  width: number
  height: number
}

export interface Note {
  id: string
  position: NotePosition
  size: NoteSize
  colour: NoteColour
  text: string
  zIndex: number
  createdAt: number
  updatedAt: number
}

export type NotesAction =
  | { type: 'ADD_NOTE'; payload: { position: NotePosition; size: NoteSize; colour: NoteColour } }
  | { type: 'REMOVE_NOTE'; payload: { id: string } }
  | { type: 'MOVE_NOTE'; payload: { id: string; position: NotePosition } }
  | { type: 'RESIZE_NOTE'; payload: { id: string; size: NoteSize } }
  | { type: 'UPDATE_TEXT'; payload: { id: string; text: string } }
  | { type: 'BRING_TO_FRONT'; payload: { id: string } }
  | { type: 'SET_NOTES'; payload: Note[] }

export interface ApiResponse<T> {
  data: T
  ok: boolean
  error?: string
}

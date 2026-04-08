import type { Note } from '@/types'
import { apiRequest } from './client'

export const notesApi = {
  getAll: () => apiRequest<Note[]>('/notes'),

  create: (note: Note) =>
    apiRequest<Note>('/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    }),

  update: (note: Note) =>
    apiRequest<Note>(`/notes/${note.id}`, {
      method: 'PUT',
      body: JSON.stringify(note),
    }),

  remove: (id: string) =>
    apiRequest<void>(`/notes/${id}`, {
      method: 'DELETE',
    }),
}

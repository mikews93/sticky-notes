import { describe, it, expect, vi, beforeEach } from 'vitest'
import { notesApi } from '@/api/notesApi'
import type { Note } from '@/types'

const mockNote: Note = {
  id: 'test-id-1',
  position: { x: 100, y: 150 },
  size: { width: 200, height: 180 },
  colour: 'yellow',
  text: 'Test note',
  zIndex: 1,
  createdAt: 1712534400000,
  updatedAt: 1712534400000,
}

describe('notesApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('getAll fetches from /notes', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([mockNote]),
    })
    vi.stubGlobal('fetch', mockFetch)

    const result = await notesApi.getAll()

    expect(result.ok).toBe(true)
    expect(result.data).toEqual([mockNote])
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/notes',
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
      }),
    )
  })

  it('create posts to /notes', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockNote),
    })
    vi.stubGlobal('fetch', mockFetch)

    const result = await notesApi.create(mockNote)

    expect(result.ok).toBe(true)
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/notes',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(mockNote),
      }),
    )
  })

  it('update puts to /notes/:id', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockNote),
    })
    vi.stubGlobal('fetch', mockFetch)

    const result = await notesApi.update(mockNote)

    expect(result.ok).toBe(true)
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/notes/test-id-1',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(mockNote),
      }),
    )
  })

  it('remove deletes /notes/:id', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    })
    vi.stubGlobal('fetch', mockFetch)

    const result = await notesApi.remove('test-id-1')

    expect(result.ok).toBe(true)
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/notes/test-id-1',
      expect.objectContaining({ method: 'DELETE' }),
    )
  })

  it('returns error response on fetch failure', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))
    vi.stubGlobal('fetch', mockFetch)

    const result = await notesApi.getAll()

    expect(result.ok).toBe(false)
    expect(result.error).toContain('Network error')
  })

  it('returns error response on non-ok status', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    })
    vi.stubGlobal('fetch', mockFetch)

    const result = await notesApi.getAll()

    expect(result.ok).toBe(false)
    expect(result.error).toContain('500')
  })
})

import type { ApiResponse } from '@/types'

const API_BASE = 'http://localhost:3001'
const SIMULATED_DELAY = 300

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY))

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const data = await res.json()
    return { data, ok: true }
  } catch (error) {
    console.error('API error:', error)
    return { data: null as T, ok: false, error: String(error) }
  }
}

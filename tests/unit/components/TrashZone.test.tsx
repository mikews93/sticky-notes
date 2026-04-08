import { describe, it, expect } from 'vitest'
import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { TrashZone } from '@/components/TrashZone'

describe('TrashZone', () => {
  it('renders the trash zone element', () => {
    render(<TrashZone isActive={false} />)
    expect(screen.getByTestId('trash-zone')).toBeInTheDocument()
  })

  it('shows "Drop here to trash" text when inactive', () => {
    render(<TrashZone isActive={false} />)
    expect(screen.getByText(/drop here to trash/i)).toBeInTheDocument()
  })

  it('shows "Release to Delete" text when active', () => {
    render(<TrashZone isActive={true} />)
    expect(screen.getByText(/release to delete/i)).toBeInTheDocument()
  })

  it('has pointer-events-none so it does not interfere with drag', () => {
    render(<TrashZone isActive={false} />)
    const el = screen.getByTestId('trash-zone')
    expect(el.className).toContain('pointer-events-none')
  })

  it('forwards ref to the underlying div', () => {
    const ref = createRef<HTMLDivElement>()
    render(<TrashZone ref={ref} isActive={false} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current?.getAttribute('data-testid')).toBe('trash-zone')
  })

  it('applies the pulse-glow animation class when active', () => {
    render(<TrashZone isActive={true} />)
    const el = screen.getByTestId('trash-zone')
    expect(el.className).toContain('animate-pulse-glow')
  })

  it('does not apply the pulse-glow animation class when inactive', () => {
    render(<TrashZone isActive={false} />)
    const el = screen.getByTestId('trash-zone')
    expect(el.className).not.toContain('animate-pulse-glow')
  })

  it('has fixed positioning spanning full width', () => {
    render(<TrashZone isActive={false} />)
    const el = screen.getByTestId('trash-zone')
    expect(el.className).toContain('fixed')
    expect(el.className).toContain('left-0')
    expect(el.className).toContain('right-0')
  })

  it('maintains full-width classes in active state too', () => {
    render(<TrashZone isActive={true} />)
    const el = screen.getByTestId('trash-zone')
    expect(el.className).toContain('left-0')
    expect(el.className).toContain('right-0')
  })
})

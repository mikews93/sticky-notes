import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ColorPicker } from '@/components/ColorPicker'

const COLOURS = ['yellow', 'pink', 'blue', 'green', 'orange'] as const

function renderPicker(overrides = {}) {
  const defaults = {
    selectedColour: 'yellow' as const,
    onColourChange: vi.fn(),
  }
  const props = { ...defaults, ...overrides }
  return { ...render(<ColorPicker {...props} />), props }
}

describe('ColorPicker', () => {
  it('renders a radio button for each colour', () => {
    renderPicker()
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(COLOURS.length)
  })

  it('marks the selected colour as checked', () => {
    renderPicker({ selectedColour: 'blue' })
    expect(screen.getByLabelText('blue')).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByLabelText('yellow')).toHaveAttribute('aria-checked', 'false')
  })

  it('calls onColourChange with the correct value when a swatch is clicked', async () => {
    const user = userEvent.setup()
    const { props } = renderPicker()

    await user.click(screen.getByLabelText('pink'))

    expect(props.onColourChange).toHaveBeenCalledWith('pink')
  })

  it('has an accessible radiogroup label', () => {
    renderPicker()
    expect(screen.getByRole('radiogroup', { name: /note color/i })).toBeInTheDocument()
  })

  it('each swatch has an aria-label matching its colour name', () => {
    renderPicker()
    for (const colour of COLOURS) {
      expect(screen.getByLabelText(colour)).toBeInTheDocument()
    }
  })
})

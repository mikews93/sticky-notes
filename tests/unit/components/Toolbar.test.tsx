import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toolbar } from '@/components/Toolbar'

function renderToolbar(overrides = {}) {
  const defaults = {
    selectedColour: 'yellow' as const,
    isDarkMode: false,
    onToggleDarkMode: vi.fn(),
    onColourChange: vi.fn(),
    onAddNote: vi.fn(),
  }
  const props = { ...defaults, ...overrides }
  return { ...render(<Toolbar {...props} />), props }
}

describe('Toolbar', () => {
  it('renders the title', () => {
    renderToolbar()
    expect(screen.getByText("Stick 'Em Up")).toBeInTheDocument()
  })

  it('renders the add-note button', () => {
    renderToolbar()
    expect(screen.getByTestId('add-note-button')).toBeInTheDocument()
  })

  it('calls onAddNote when the New button is clicked', async () => {
    const user = userEvent.setup()
    const { props } = renderToolbar()

    await user.click(screen.getByTestId('add-note-button'))

    expect(props.onAddNote).toHaveBeenCalledTimes(1)
  })

  it('renders the dark mode toggle button', () => {
    renderToolbar()
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument()
  })

  it('calls onToggleDarkMode when the theme toggle is clicked', async () => {
    const user = userEvent.setup()
    const { props } = renderToolbar()

    await user.click(screen.getByLabelText('Toggle theme'))

    expect(props.onToggleDarkMode).toHaveBeenCalledTimes(1)
  })

  it('renders the moon icon in light mode', () => {
    const { container } = renderToolbar({ isDarkMode: false })
    // Moon icon has a single path element with "M21 12.79..."
    const moonPath = container.querySelector('path[d*="M21 12.79"]')
    expect(moonPath).toBeInTheDocument()
  })

  it('renders the sun icon in dark mode', () => {
    const { container } = renderToolbar({ isDarkMode: true })
    // Sun icon has a circle element
    const sunCircle = container.querySelector('circle[cx="12"]')
    expect(sunCircle).toBeInTheDocument()
  })

  it('renders the ColorPicker sub-component', () => {
    renderToolbar()
    expect(screen.getByRole('radiogroup', { name: /note color/i })).toBeInTheDocument()
  })

  it('has the toolbar data-testid', () => {
    renderToolbar()
    expect(screen.getByTestId('toolbar')).toBeInTheDocument()
  })
})

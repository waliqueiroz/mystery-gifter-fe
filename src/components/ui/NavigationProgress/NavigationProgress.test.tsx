import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavigationProgress } from './NavigationProgress'

const mockPathname = jest.fn(() => '/groups')
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}))

beforeEach(() => {
  jest.clearAllMocks()
  mockPathname.mockReturnValue('/groups')
})

function makeAnchor(href: string): HTMLAnchorElement {
  const a = document.createElement('a')
  a.href = href
  document.body.appendChild(a)
  return a
}

afterEach(() => {
  document.body.querySelectorAll('a').forEach((a) => a.remove())
})

describe('NavigationProgress', () => {
  it('renderiza a barra com opacity 0 no estado idle', () => {
    render(<NavigationProgress />)
    const bar = screen.getByTestId('nav-progress-bar')
    expect(bar).toBeInTheDocument()
    expect(bar.style.width).toBe('0%')
  })

  it('exibe a barra ao clicar em um link interno de pathname diferente', async () => {
    render(<NavigationProgress />)
    const a = makeAnchor('http://localhost/groups/abc')
    await userEvent.click(a)
    const bar = screen.getByTestId('nav-progress-bar')
    // Após o requestAnimationFrame, a barra deve estar em 70%
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50))
    })
    expect(bar.style.width).toBe('70%')
  })

  it('NÃO ativa a barra ao clicar em link do mesmo pathname', async () => {
    render(<NavigationProgress />)
    const a = makeAnchor('http://localhost/groups')
    await userEvent.click(a)
    const bar = screen.getByTestId('nav-progress-bar')
    expect(bar.style.width).toBe('0%')
  })

  it('NÃO ativa a barra ao clicar em link externo', async () => {
    render(<NavigationProgress />)
    const a = makeAnchor('https://example.com/page')
    await userEvent.click(a)
    const bar = screen.getByTestId('nav-progress-bar')
    expect(bar.style.width).toBe('0%')
  })
})

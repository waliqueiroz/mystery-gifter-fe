import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Button } from './Button'

describe('Button', () => {
  describe('basic render', () => {
    it('renders the child text', () => {
      render(<Button>Entrar</Button>)
      expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
    })

    it('applies type="button" by default', () => {
      render(<Button>OK</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
    })

    it('accepts type="submit"', () => {
      render(<Button type="submit">Salvar</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
    })
  })

  describe('variants', () => {
    it('variant=primary (default) applies brand green background', () => {
      render(<Button>CTA</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-mg-green')
    })

    it('variant=secondary applies dark surface background', () => {
      render(<Button variant="secondary">Outro</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-mg-surface-2')
    })

    it('variant=outline applies muted border and transparent background', () => {
      render(<Button variant="outline">Outline</Button>)
      const btn = screen.getByRole('button')
      expect(btn).toHaveClass('bg-transparent')
      expect(btn).toHaveClass('border')
      expect(btn).toHaveClass('border-mg-border-light')
    })

    it('variant=ghost applies muted text without background', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const btn = screen.getByRole('button')
      expect(btn).toHaveClass('bg-transparent')
      expect(btn).toHaveClass('text-mg-text-muted')
    })
  })

  describe('shape', () => {
    it('shape="pill-lg" (default) applies rounded-pill-lg', () => {
      render(<Button>CTA</Button>)
      expect(screen.getByRole('button')).toHaveClass('rounded-pill-lg')
    })

    it('shape="pill" applies rounded-pill', () => {
      render(<Button shape="pill">Small</Button>)
      expect(screen.getByRole('button')).toHaveClass('rounded-pill')
    })

    it('shape="circle" applies rounded-full, aspect-square and equal h/w', () => {
      render(<Button shape="circle" aria-label="Play">▶</Button>)
      const btn = screen.getByRole('button')
      expect(btn).toHaveClass('rounded-full')
      expect(btn).toHaveClass('aspect-square')
      expect(btn).toHaveClass('h-10')
      expect(btn).toHaveClass('w-10')
    })

    it('shape="circle" ignores uppercase even if uppercase=true', () => {
      render(
        <Button shape="circle" uppercase aria-label="Play">
          play
        </Button>,
      )
      expect(screen.getByRole('button')).not.toHaveClass('uppercase')
    })
  })

  describe('size', () => {
    it('size="md" (default) applies h-10', () => {
      render(<Button>OK</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-10')
    })

    it('size="sm" applies h-8 px-3 text-xs', () => {
      render(<Button size="sm">SM</Button>)
      const btn = screen.getByRole('button')
      expect(btn).toHaveClass('h-8')
      expect(btn).toHaveClass('px-3')
      expect(btn).toHaveClass('text-xs')
    })

    it('size="lg" applies h-12 px-6 text-base', () => {
      render(<Button size="lg">LG</Button>)
      const btn = screen.getByRole('button')
      expect(btn).toHaveClass('h-12')
      expect(btn).toHaveClass('px-6')
      expect(btn).toHaveClass('text-base')
    })
  })

  describe('uppercase', () => {
    it('uppercase=true (default) applies uppercase + tracking-btn', () => {
      render(<Button>Confirmar</Button>)
      const btn = screen.getByRole('button')
      expect(btn).toHaveClass('uppercase')
      expect(btn).toHaveClass('tracking-btn')
    })

    it('uppercase=false does not apply uppercase or tracking-btn', () => {
      render(<Button uppercase={false}>Confirmar</Button>)
      const btn = screen.getByRole('button')
      expect(btn).not.toHaveClass('uppercase')
      expect(btn).not.toHaveClass('tracking-btn')
    })
  })

  describe('loading state', () => {
    it('exposes aria-busy=true and disables the button', () => {
      render(<Button loading>Salvando</Button>)
      const btn = screen.getByRole('button')
      expect(btn).toBeDisabled()
      expect(btn).toHaveAttribute('aria-busy', 'true')
    })

    it('replaces content with skeleton, never with spinner', () => {
      render(<Button loading>Salvando</Button>)
      expect(document.querySelector('.react-loading-skeleton')).not.toBeNull()
      expect(screen.queryByRole('status')).toBeNull()
    })

    it('does not display children text during loading', () => {
      render(<Button loading>Salvando</Button>)
      expect(screen.queryByText('Salvando')).toBeNull()
    })
  })

  describe('disabled state', () => {
    it('disables the button and applies disabled:opacity-60', () => {
      render(<Button disabled>Entrar</Button>)
      const btn = screen.getByRole('button')
      expect(btn).toBeDisabled()
      expect(btn).toHaveClass('disabled:opacity-60')
    })
  })

  describe('interaction', () => {
    it('fires onClick on click', async () => {
      const handle = jest.fn()
      render(<Button onClick={handle}>Entrar</Button>)
      await userEvent.click(screen.getByRole('button'))
      expect(handle).toHaveBeenCalledTimes(1)
    })

    it('does NOT fire onClick when disabled', async () => {
      const handle = jest.fn()
      render(
        <Button disabled onClick={handle}>
          Entrar
        </Button>,
      )
      await userEvent.click(screen.getByRole('button'))
      expect(handle).not.toHaveBeenCalled()
    })

    it('does NOT fire onClick when loading', async () => {
      const handle = jest.fn()
      render(
        <Button loading onClick={handle}>
          Salvando
        </Button>,
      )
      await userEvent.click(screen.getByRole('button'))
      expect(handle).not.toHaveBeenCalled()
    })
  })

  describe('icons and aria-label', () => {
    it('renders iconLeft before the text', () => {
      render(
        <Button iconLeft={<span data-testid="left">L</span>}>Texto</Button>,
      )
      const btn = screen.getByRole('button')
      const leftIcon = screen.getByTestId('left')
      expect(btn.firstChild).toBe(leftIcon)
    })

    it('renders iconRight after the text', () => {
      render(
        <Button iconRight={<span data-testid="right">R</span>}>Texto</Button>,
      )
      const btn = screen.getByRole('button')
      const rightIcon = screen.getByTestId('right')
      expect(btn.lastChild).toBe(rightIcon)
    })

    it('exposes aria-label when passed (circular buttons without text)', () => {
      render(
        <Button shape="circle" aria-label="Play">
          ▶
        </Button>,
      )
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Play')
    })
  })
})

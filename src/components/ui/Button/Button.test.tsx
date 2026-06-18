import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Button from './Button'

describe('Button', () => {
  describe('render básico', () => {
    it('renderiza o texto filho', () => {
      render(<Button>Entrar</Button>)
      expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
    })

    it('aplica type="button" por padrão', () => {
      render(<Button>OK</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
    })

    it('aceita type="submit"', () => {
      render(<Button type="submit">Salvar</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
    })
  })

  describe('variantes', () => {
    it('variant=primary (default) aplica fundo verde de marca', () => {
      render(<Button>CTA</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-mg-green')
    })

    it('variant=secondary aplica fundo de superfície escura', () => {
      render(<Button variant="secondary">Outro</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-mg-surface-2')
    })

    it('variant=outline aplica borda muted e fundo transparente', () => {
      render(<Button variant="outline">Outline</Button>)
      const btn = screen.getByRole('button')
      expect(btn).toHaveClass('bg-transparent')
      expect(btn).toHaveClass('border')
      expect(btn).toHaveClass('border-mg-border-light')
    })

    it('variant=ghost aplica texto muted sem fundo', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const btn = screen.getByRole('button')
      expect(btn).toHaveClass('bg-transparent')
      expect(btn).toHaveClass('text-mg-text-muted')
    })
  })

  describe('shape', () => {
    it('shape="pill-lg" (default) aplica rounded-pill-lg', () => {
      render(<Button>CTA</Button>)
      expect(screen.getByRole('button')).toHaveClass('rounded-pill-lg')
    })

    it('shape="pill" aplica rounded-pill', () => {
      render(<Button shape="pill">Small</Button>)
      expect(screen.getByRole('button')).toHaveClass('rounded-pill')
    })

    it('shape="circle" aplica rounded-full, aspect-square e h/w iguais', () => {
      render(<Button shape="circle" aria-label="Play">▶</Button>)
      const btn = screen.getByRole('button')
      expect(btn).toHaveClass('rounded-full')
      expect(btn).toHaveClass('aspect-square')
      expect(btn).toHaveClass('h-10')
      expect(btn).toHaveClass('w-10')
    })

    it('shape="circle" ignora uppercase mesmo se uppercase=true', () => {
      render(
        <Button shape="circle" uppercase aria-label="Play">
          play
        </Button>,
      )
      expect(screen.getByRole('button')).not.toHaveClass('uppercase')
    })
  })

  describe('size', () => {
    it('size="md" (default) aplica h-10', () => {
      render(<Button>OK</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-10')
    })

    it('size="sm" aplica h-8 px-3 text-xs', () => {
      render(<Button size="sm">SM</Button>)
      const btn = screen.getByRole('button')
      expect(btn).toHaveClass('h-8')
      expect(btn).toHaveClass('px-3')
      expect(btn).toHaveClass('text-xs')
    })

    it('size="lg" aplica h-12 px-6 text-base', () => {
      render(<Button size="lg">LG</Button>)
      const btn = screen.getByRole('button')
      expect(btn).toHaveClass('h-12')
      expect(btn).toHaveClass('px-6')
      expect(btn).toHaveClass('text-base')
    })
  })

  describe('uppercase', () => {
    it('uppercase=true (default) aplica uppercase + tracking-btn', () => {
      render(<Button>Confirmar</Button>)
      const btn = screen.getByRole('button')
      expect(btn).toHaveClass('uppercase')
      expect(btn).toHaveClass('tracking-btn')
    })

    it('uppercase=false não aplica uppercase nem tracking-btn', () => {
      render(<Button uppercase={false}>Confirmar</Button>)
      const btn = screen.getByRole('button')
      expect(btn).not.toHaveClass('uppercase')
      expect(btn).not.toHaveClass('tracking-btn')
    })
  })

  describe('estado loading', () => {
    it('expõe aria-busy=true e desabilita o botão', () => {
      render(<Button loading>Salvando</Button>)
      const btn = screen.getByRole('button')
      expect(btn).toBeDisabled()
      expect(btn).toHaveAttribute('aria-busy', 'true')
    })

    it('substitui o conteúdo por skeleton, jamais por spinner', () => {
      render(<Button loading>Salvando</Button>)
      expect(document.querySelector('.react-loading-skeleton')).not.toBeNull()
      expect(screen.queryByRole('status')).toBeNull()
    })

    it('não exibe texto do children durante loading', () => {
      render(<Button loading>Salvando</Button>)
      expect(screen.queryByText('Salvando')).toBeNull()
    })
  })

  describe('estado disabled', () => {
    it('desabilita o botão e aplica disabled:opacity-60', () => {
      render(<Button disabled>Entrar</Button>)
      const btn = screen.getByRole('button')
      expect(btn).toBeDisabled()
      expect(btn).toHaveClass('disabled:opacity-60')
    })
  })

  describe('interação', () => {
    it('dispara onClick em click', async () => {
      const handle = jest.fn()
      render(<Button onClick={handle}>Entrar</Button>)
      await userEvent.click(screen.getByRole('button'))
      expect(handle).toHaveBeenCalledTimes(1)
    })

    it('NÃO dispara onClick quando disabled', async () => {
      const handle = jest.fn()
      render(
        <Button disabled onClick={handle}>
          Entrar
        </Button>,
      )
      await userEvent.click(screen.getByRole('button'))
      expect(handle).not.toHaveBeenCalled()
    })

    it('NÃO dispara onClick quando loading', async () => {
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

  describe('ícones e aria-label', () => {
    it('renderiza iconLeft antes do texto', () => {
      render(
        <Button iconLeft={<span data-testid="left">L</span>}>Texto</Button>,
      )
      const btn = screen.getByRole('button')
      const leftIcon = screen.getByTestId('left')
      expect(btn.firstChild).toBe(leftIcon)
    })

    it('renderiza iconRight depois do texto', () => {
      render(
        <Button iconRight={<span data-testid="right">R</span>}>Texto</Button>,
      )
      const btn = screen.getByRole('button')
      const rightIcon = screen.getByTestId('right')
      expect(btn.lastChild).toBe(rightIcon)
    })

    it('expõe aria-label quando passado (botões circulares sem texto)', () => {
      render(
        <Button shape="circle" aria-label="Play">
          ▶
        </Button>,
      )
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Play')
    })
  })
})

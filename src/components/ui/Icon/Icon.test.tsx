import { render } from '@testing-library/react'

import { Icon } from './Icon'

describe('Icon', () => {
  it('renderiza o ícone solicitado de lucide-react', () => {
    const { container } = render(<Icon name="X" />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
  })

  it('aplica tamanho padrão 20', () => {
    const { container } = render(<Icon name="X" />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('width')).toBe('20')
    expect(svg.getAttribute('height')).toBe('20')
  })

  it('aplica tamanho customizado', () => {
    const { container } = render(<Icon name="X" size={32} />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('width')).toBe('32')
    expect(svg.getAttribute('height')).toBe('32')
  })

  it('é decorativo por padrão (aria-hidden=true, sem aria-label)', () => {
    const { container } = render(<Icon name="X" />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('aria-hidden')).toBe('true')
    expect(svg.getAttribute('aria-label')).toBeNull()
  })

  it('expõe aria-label quando passado e aria-hidden=false', () => {
    const { container } = render(
      <Icon name="X" aria-hidden={false} aria-label="Fechar" />,
    )
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('aria-hidden')).toBe('false')
    expect(svg.getAttribute('aria-label')).toBe('Fechar')
  })

  it('compõe className adicional com o shrink-0 default', () => {
    const { container } = render(<Icon name="X" className="text-mg-green" />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('class')).toContain('shrink-0')
    expect(svg.getAttribute('class')).toContain('text-mg-green')
  })

  it('marca focusable=false para não capturar tab nativamente', () => {
    const { container } = render(<Icon name="X" />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('focusable')).toBe('false')
  })
})

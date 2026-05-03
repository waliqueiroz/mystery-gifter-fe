import { render, screen } from '@testing-library/react'
import { GroupStatusBadge } from './GroupStatusBadge'

describe('GroupStatusBadge', () => {
  it('renders "Aberto" for OPEN status', () => {
    render(<GroupStatusBadge status="OPEN" />)
    expect(screen.getByText('Aberto')).toBeInTheDocument()
  })

  it('renders "Sorteio realizado" for MATCHED status', () => {
    render(<GroupStatusBadge status="MATCHED" />)
    expect(screen.getByText('Sorteio realizado')).toBeInTheDocument()
  })

  it('renders "Arquivado" for ARCHIVED status', () => {
    render(<GroupStatusBadge status="ARCHIVED" />)
    expect(screen.getByText('Arquivado')).toBeInTheDocument()
  })

  it('applies mg-badge-open class for OPEN status', () => {
    const { container } = render(<GroupStatusBadge status="OPEN" />)
    expect(container.firstChild).toHaveClass('mg-badge-open')
  })

  it('applies mg-badge-matched class for MATCHED status', () => {
    const { container } = render(<GroupStatusBadge status="MATCHED" />)
    expect(container.firstChild).toHaveClass('mg-badge-matched')
  })

  it('applies mg-badge-archived class for ARCHIVED status', () => {
    const { container } = render(<GroupStatusBadge status="ARCHIVED" />)
    expect(container.firstChild).toHaveClass('mg-badge-archived')
  })
})

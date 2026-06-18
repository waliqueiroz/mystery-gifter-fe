import { render, screen } from '@testing-library/react'

import { GroupStatusBadge } from './GroupStatusBadge'

describe('GroupStatusBadge', () => {
  describe('rótulos pt-BR por status', () => {
    it('OPEN → "Aberto"', () => {
      render(<GroupStatusBadge status="OPEN" />)
      expect(screen.getByText('Aberto')).toBeInTheDocument()
    })

    it('MATCHED → "Sorteio realizado"', () => {
      render(<GroupStatusBadge status="MATCHED" />)
      expect(screen.getByText('Sorteio realizado')).toBeInTheDocument()
    })

    it('ARCHIVED → "Arquivado"', () => {
      render(<GroupStatusBadge status="ARCHIVED" />)
      expect(screen.getByText('Arquivado')).toBeInTheDocument()
    })
  })

  describe('geometria pill + tipografia uppercase tracking', () => {
    it('OPEN aplica pill + uppercase + tracking-btn', () => {
      render(<GroupStatusBadge status="OPEN" />)
      const badge = screen.getByText('Aberto')
      expect(badge).toHaveClass('rounded-pill')
      expect(badge).toHaveClass('uppercase')
      expect(badge).toHaveClass('tracking-btn')
    })
  })

  describe('paleta semântica', () => {
    it('OPEN aplica verde funcional (FR-008 — grupo ativo)', () => {
      render(<GroupStatusBadge status="OPEN" />)
      const badge = screen.getByText('Aberto')
      expect(badge).toHaveClass('text-mg-green')
      expect(badge.getAttribute('class')).toContain('bg-mg-green/10')
    })

    it('MATCHED é neutro (sem verde decorativo)', () => {
      render(<GroupStatusBadge status="MATCHED" />)
      const badge = screen.getByText('Sorteio realizado')
      expect(badge).toHaveClass('text-mg-text')
      expect(badge).not.toHaveClass('text-mg-green')
    })

    it('ARCHIVED é muted (estado passivo)', () => {
      render(<GroupStatusBadge status="ARCHIVED" />)
      const badge = screen.getByText('Arquivado')
      expect(badge).toHaveClass('text-mg-text-muted')
    })
  })
})

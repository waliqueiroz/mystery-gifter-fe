import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { GroupFilterParams } from '@/types/api'
import { DEFAULT_GROUP_FILTERS } from '@/types/api'

import { GroupFilters } from './GroupFilters'

const defaultFilters: GroupFilterParams = { ...DEFAULT_GROUP_FILTERS }

describe('GroupFilters', () => {
  it('renderiza o input de busca com o valor atual', () => {
    render(
      <GroupFilters
        filters={{ ...defaultFilters, name: 'natal' }}
        onChange={jest.fn()}
      />,
    )
    expect(screen.getByDisplayValue('natal')).toBeInTheDocument()
  })

  describe('chips de status', () => {
    it('Aberto e Sorteado começam aria-pressed=true por default; Arquivado false', () => {
      render(<GroupFilters filters={defaultFilters} onChange={jest.fn()} />)
      expect(screen.getByRole('button', { name: 'Aberto' })).toHaveAttribute(
        'aria-pressed',
        'true',
      )
      expect(screen.getByRole('button', { name: 'Sorteado' })).toHaveAttribute(
        'aria-pressed',
        'true',
      )
      expect(
        screen.getByRole('button', { name: 'Arquivado' }),
      ).toHaveAttribute('aria-pressed', 'false')
    })

    it('chip ativo aplica fundo e texto verde funcional', () => {
      render(<GroupFilters filters={defaultFilters} onChange={jest.fn()} />)
      const aberto = screen.getByRole('button', { name: 'Aberto' })
      expect(aberto).toHaveClass('text-mg-green')
      expect(aberto.getAttribute('class')).toContain('bg-mg-green/15')
    })

    it('chip inativo é muted', () => {
      render(<GroupFilters filters={defaultFilters} onChange={jest.fn()} />)
      const arquivado = screen.getByRole('button', { name: 'Arquivado' })
      expect(arquivado).toHaveClass('text-mg-text-muted')
    })

    it('clique em chip inativo adiciona o status', async () => {
      const onChange = jest.fn()
      render(<GroupFilters filters={defaultFilters} onChange={onChange} />)
      await userEvent.click(screen.getByRole('button', { name: 'Arquivado' }))
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          statuses: expect.arrayContaining(['OPEN', 'MATCHED', 'ARCHIVED']),
        }),
      )
    })

    it('clique em chip ativo remove o status', async () => {
      const onChange = jest.fn()
      render(<GroupFilters filters={defaultFilters} onChange={onChange} />)
      await userEvent.click(screen.getByRole('button', { name: 'Aberto' }))
      const calledWith = onChange.mock.calls[0][0] as GroupFilterParams
      expect(calledWith.statuses).not.toContain('OPEN')
    })
  })

  describe('debounce do nome', () => {
    beforeEach(() => jest.useFakeTimers())
    afterEach(() => {
      act(() => jest.runOnlyPendingTimers())
      jest.useRealTimers()
    })

    function getSearchInput() {
      return screen.getByLabelText(/buscar por nome/i) as HTMLInputElement
    }

    it('NÃO chama onChange imediatamente ao digitar', () => {
      const onChange = jest.fn()
      render(<GroupFilters filters={defaultFilters} onChange={onChange} />)
      fireEvent.change(getSearchInput(), { target: { value: 'natal' } })
      expect(onChange).not.toHaveBeenCalled()
    })

    it('chama onChange com o nome atualizado após 400ms', () => {
      const onChange = jest.fn()
      render(<GroupFilters filters={defaultFilters} onChange={onChange} />)
      fireEvent.change(getSearchInput(), { target: { value: 'natal' } })
      act(() => jest.advanceTimersByTime(400))
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'natal' }),
      )
    })

    it('cancela o timer anterior se o usuário digita de novo antes de 400ms', () => {
      const onChange = jest.fn()
      render(<GroupFilters filters={defaultFilters} onChange={onChange} />)
      const input = getSearchInput()
      fireEvent.change(input, { target: { value: 'a' } })
      act(() => jest.advanceTimersByTime(200))
      fireEvent.change(input, { target: { value: 'ab' } })
      act(() => jest.advanceTimersByTime(400))
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'ab' }),
      )
    })
  })

  describe('toggle de ordenação', () => {
    it('"Mais recentes" começa aria-pressed=true (DEFAULT_GROUP_FILTERS = DESC)', () => {
      render(<GroupFilters filters={defaultFilters} onChange={jest.fn()} />)
      expect(
        screen.getByRole('button', { name: /mais recentes/i }),
      ).toHaveAttribute('aria-pressed', 'true')
      expect(
        screen.getByRole('button', { name: /mais antigos/i }),
      ).toHaveAttribute('aria-pressed', 'false')
    })

    it('clique em "Mais antigos" muda sortDirection para ASC', async () => {
      const onChange = jest.fn()
      render(<GroupFilters filters={defaultFilters} onChange={onChange} />)
      await userEvent.click(
        screen.getByRole('button', { name: /mais antigos/i }),
      )
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ sortDirection: 'ASC' }),
      )
    })

    it('clique no toggle ativo NÃO dispara onChange', async () => {
      const onChange = jest.fn()
      render(<GroupFilters filters={defaultFilters} onChange={onChange} />)
      await userEvent.click(
        screen.getByRole('button', { name: /mais recentes/i }),
      )
      const sortCalls = onChange.mock.calls.filter((c) =>
        Object.prototype.hasOwnProperty.call(c[0], 'sortDirection'),
      )
      expect(sortCalls.length).toBe(0)
    })
  })
})

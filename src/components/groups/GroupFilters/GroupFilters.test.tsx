import { act, render, screen } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GroupFilters } from './GroupFilters'
import type { GroupFilterParams } from '@/types/api'
import { DEFAULT_GROUP_FILTERS } from '@/types/api'

const defaultFilters: GroupFilterParams = { ...DEFAULT_GROUP_FILTERS }

describe('GroupFilters', () => {
  it('renders name input with current value', () => {
    render(<GroupFilters filters={{ ...defaultFilters, name: 'natal' }} onChange={jest.fn()} />)
    expect(screen.getByDisplayValue('natal')).toBeInTheDocument()
  })

  it('renders OPEN and MATCHED checkboxes as checked by default', () => {
    render(<GroupFilters filters={defaultFilters} onChange={jest.fn()} />)
    expect(screen.getByRole('checkbox', { name: 'Aberto' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Sorteado' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Arquivado' })).not.toBeChecked()
  })

  describe('name input debounce', () => {
    beforeEach(() => jest.useFakeTimers())
    afterEach(() => {
      act(() => jest.runOnlyPendingTimers())
      jest.useRealTimers()
    })

    it('does not call onChange immediately when user types', () => {
      const onChange = jest.fn()
      render(<GroupFilters filters={defaultFilters} onChange={onChange} />)
      fireEvent.change(screen.getByRole('textbox', { name: /buscar por nome/i }), {
        target: { value: 'natal' },
      })
      expect(onChange).not.toHaveBeenCalled()
    })

    it('calls onChange with updated name after 400ms debounce', () => {
      const onChange = jest.fn()
      render(<GroupFilters filters={defaultFilters} onChange={onChange} />)
      fireEvent.change(screen.getByRole('textbox', { name: /buscar por nome/i }), {
        target: { value: 'natal' },
      })
      act(() => jest.advanceTimersByTime(400))
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ name: 'natal' }))
    })

    it('cancels previous timer if user types again before 400ms', () => {
      const onChange = jest.fn()
      render(<GroupFilters filters={defaultFilters} onChange={onChange} />)
      const input = screen.getByRole('textbox', { name: /buscar por nome/i })
      fireEvent.change(input, { target: { value: 'a' } })
      act(() => jest.advanceTimersByTime(200))
      fireEvent.change(input, { target: { value: 'ab' } })
      act(() => jest.advanceTimersByTime(400))
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ name: 'ab' }))
    })
  })

  it('calls onChange with ARCHIVED added when its checkbox is checked', async () => {
    const onChange = jest.fn()
    render(<GroupFilters filters={defaultFilters} onChange={onChange} />)
    await userEvent.click(screen.getByRole('checkbox', { name: 'Arquivado' }))
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ statuses: expect.arrayContaining(['OPEN', 'MATCHED', 'ARCHIVED']) }),
    )
  })

  it('calls onChange with OPEN removed when its checkbox is unchecked', async () => {
    const onChange = jest.fn()
    render(<GroupFilters filters={defaultFilters} onChange={onChange} />)
    await userEvent.click(screen.getByRole('checkbox', { name: 'Aberto' }))
    const calledWith = onChange.mock.calls[0][0] as GroupFilterParams
    expect(calledWith.statuses).not.toContain('OPEN')
  })

  it('calls onChange with sortDirection ASC when "Mais antigos" is selected', async () => {
    const onChange = jest.fn()
    render(<GroupFilters filters={defaultFilters} onChange={onChange} />)
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /ordenar por/i }), 'ASC')
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ sortDirection: 'ASC' }))
  })

  it('renders "Mais recentes" as the default selected sort option', () => {
    render(<GroupFilters filters={defaultFilters} onChange={jest.fn()} />)
    expect(screen.getByRole('combobox', { name: /ordenar por/i })).toHaveValue('DESC')
  })
})

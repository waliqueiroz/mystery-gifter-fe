import { render, screen } from '@testing-library/react'
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

  it('calls onChange with updated name when user types', async () => {
    const onChange = jest.fn()
    render(<GroupFilters filters={defaultFilters} onChange={onChange} />)
    await userEvent.type(screen.getByRole('textbox', { name: /buscar por nome/i }), 'n')
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ name: 'n' }))
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

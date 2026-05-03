import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GroupEmptyState } from './GroupEmptyState'

describe('GroupEmptyState', () => {
  it('renders the empty state heading', () => {
    render(<GroupEmptyState onCreateClick={() => {}} />)
    expect(screen.getByText('Nenhum grupo ainda')).toBeInTheDocument()
  })

  it('renders the descriptive text', () => {
    render(<GroupEmptyState onCreateClick={() => {}} />)
    expect(
      screen.getByText(/Crie seu primeiro grupo de Amigo Secreto/i),
    ).toBeInTheDocument()
  })

  it('renders the create button', () => {
    render(<GroupEmptyState onCreateClick={() => {}} />)
    expect(screen.getByRole('button', { name: /criar grupo/i })).toBeInTheDocument()
  })

  it('calls onCreateClick when the button is clicked', async () => {
    const onCreateClick = jest.fn()
    render(<GroupEmptyState onCreateClick={onCreateClick} />)
    await userEvent.click(screen.getByRole('button', { name: /criar grupo/i }))
    expect(onCreateClick).toHaveBeenCalledTimes(1)
  })
})

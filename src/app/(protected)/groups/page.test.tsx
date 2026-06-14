import { render, screen } from '@testing-library/react'
import GroupsPage from './page'

jest.mock('@/components/groups/GroupList/GroupList', () => ({
  GroupList: () => <div data-testid="group-list" />,
}))

describe('GroupsPage', () => {
  it('renders GroupList', () => {
    render(<GroupsPage />)
    expect(screen.getByTestId('group-list')).toBeInTheDocument()
  })

  it('renders page heading', () => {
    render(<GroupsPage />)
    expect(screen.getByRole('heading', { name: /grupos/i })).toBeInTheDocument()
  })
})

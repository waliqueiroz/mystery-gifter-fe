import { render, screen } from '@testing-library/react'

import GroupsPage from './page'

jest.mock('@/components/groups/GroupList/GroupList', () => ({
  GroupList: () => <div data-testid="group-list">grupos</div>,
}))

describe('GroupsPage', () => {
  it('renders GroupList as the content of the /groups route', () => {
    render(<GroupsPage />)
    expect(screen.getByTestId('group-list')).toBeInTheDocument()
  })
})

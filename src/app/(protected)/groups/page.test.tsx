import { render, screen } from '@testing-library/react'

import GroupsPage from './page'

jest.mock('@/components/groups/GroupList/GroupList', () => ({
  GroupList: () => <div data-testid="group-list">grupos</div>,
}))

describe('GroupsPage', () => {
  it('renderiza GroupList como conteúdo da rota /groups', () => {
    render(<GroupsPage />)
    expect(screen.getByTestId('group-list')).toBeInTheDocument()
  })
})

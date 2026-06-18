import { render, screen } from '@testing-library/react'
import GroupsLoading from './loading'

describe('GroupsLoading', () => {
  it('renderiza o skeleton da lista de grupos', () => {
    render(<GroupsLoading />)
    expect(screen.getByTestId('groups-loading')).toBeInTheDocument()
  })
})

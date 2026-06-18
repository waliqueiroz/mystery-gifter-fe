import { render, screen } from '@testing-library/react'
import InviteLoading from './loading'

describe('InviteLoading', () => {
  it('renderiza o skeleton da página de convite', () => {
    render(<InviteLoading />)
    expect(screen.getByTestId('invite-loading')).toBeInTheDocument()
  })
})

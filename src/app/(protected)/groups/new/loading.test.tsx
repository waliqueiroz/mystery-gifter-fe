import { render, screen } from '@testing-library/react'
import NewGroupLoading from './loading'

describe('NewGroupLoading', () => {
  it('renderiza o skeleton da página de criação de grupo', () => {
    render(<NewGroupLoading />)
    expect(screen.getByTestId('new-group-loading')).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import GroupDetailLoading from './loading'

describe('GroupDetailLoading', () => {
  it('renderiza o skeleton do detalhe de grupo', () => {
    render(<GroupDetailLoading />)
    expect(screen.getByTestId('group-detail-loading')).toBeInTheDocument()
  })
})

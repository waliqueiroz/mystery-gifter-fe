import { render, screen } from '@testing-library/react'
import ProfileLoading from './loading'

describe('ProfileLoading', () => {
  it('renderiza o skeleton da página de perfil', () => {
    render(<ProfileLoading />)
    expect(screen.getByTestId('profile-loading')).toBeInTheDocument()
  })
})

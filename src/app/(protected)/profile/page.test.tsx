import { render, screen } from '@testing-library/react'
import ProfilePage from './page'

jest.mock('@/components/profile/ProfileCard/ProfileCard', () => ({
  ProfileCard: () => <div data-testid="profile-card" />,
}))

jest.mock('@/components/profile/LogoutButton/LogoutButton', () => ({
  LogoutButton: () => <button data-testid="logout-button">Sair</button>,
}))

describe('ProfilePage', () => {
  it('renders the ProfileCard component', () => {
    render(<ProfilePage />)
    expect(screen.getByTestId('profile-card')).toBeInTheDocument()
  })

  it('renders the page heading', () => {
    render(<ProfilePage />)
    expect(screen.getByRole('heading', { name: /meu perfil/i })).toBeInTheDocument()
  })

  it('renders the LogoutButton component', () => {
    render(<ProfilePage />)
    expect(screen.getByTestId('logout-button')).toBeInTheDocument()
  })
})

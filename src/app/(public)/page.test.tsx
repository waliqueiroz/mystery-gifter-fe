import { render, screen } from '@testing-library/react'

import HomePage from './page'

jest.mock('@/components/auth/GuestGuard', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

jest.mock('@/components/landing/HeroSection', () => ({
  __esModule: true,
  default: () => <div data-testid="hero-section">hero</div>,
}))

describe('HomePage (landing)', () => {
  it('renders HeroSection wrapped in GuestGuard', () => {
    render(<HomePage />)
    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
  })
})

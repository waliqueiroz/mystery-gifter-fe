import { render, screen } from '@testing-library/react'

import HomePage from './page'

jest.mock('@/components/auth/GuestGuard/GuestGuard', () => ({
  GuestGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

jest.mock('@/components/landing/HeroSection/HeroSection', () => ({
  HeroSection: () => <div data-testid="hero-section">hero</div>,
}))

describe('HomePage (landing)', () => {
  it('renders HeroSection wrapped in GuestGuard', () => {
    render(<HomePage />)
    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
  })
})

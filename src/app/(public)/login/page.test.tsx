import { render, screen } from '@testing-library/react'

import LoginPage from './page'

jest.mock('@/components/auth/GuestGuard', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

jest.mock('@/components/login/LoginForm', () => ({
  __esModule: true,
  default: () => <div data-testid="login-form">login form</div>,
}))

describe('LoginPage', () => {
  it('renderiza o LoginForm envolto em GuestGuard', () => {
    render(<LoginPage />)
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
  })
})

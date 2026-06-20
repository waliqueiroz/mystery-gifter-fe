import { render, screen } from '@testing-library/react'

import LoginPage from './page'

jest.mock('@/components/auth/GuestGuard/GuestGuard', () => ({
  GuestGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

jest.mock('@/components/login/LoginForm/LoginForm', () => ({
  LoginForm: () => <div data-testid="login-form">login form</div>,
}))

describe('LoginPage', () => {
  it('renders LoginForm wrapped in GuestGuard', () => {
    render(<LoginPage />)
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
  })
})

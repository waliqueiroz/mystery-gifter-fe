import { render, screen } from '@testing-library/react'

import RegisterPage from './page'

jest.mock('@/components/auth/GuestGuard/GuestGuard', () => ({
  GuestGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

jest.mock('@/components/register/RegisterForm/RegisterForm', () => ({
  RegisterForm: () => <div data-testid="register-form">register form</div>,
}))

describe('RegisterPage', () => {
  it('renders RegisterForm wrapped in GuestGuard', () => {
    render(<RegisterPage />)
    expect(screen.getByTestId('register-form')).toBeInTheDocument()
  })
})

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'
import * as authService from '@/services/api/authService'
import * as auth from '@/lib/auth'
import { UnauthorizedError } from '@/lib/errors'

const mockPush = jest.fn()
const mockGet = jest.fn().mockReturnValue(null)

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({ get: mockGet }),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

jest.mock('@/services/api/authService', () => ({ login: jest.fn() }))
jest.mock('@/lib/auth', () => ({ setSession: jest.fn() }))

const mockLogin = authService.login as jest.Mock
const mockSetSession = auth.setSession as jest.Mock

const mockSession = {
  access_token: 'jwt-token',
  token_type: 'Bearer' as const,
  expires_in: 3600,
  user: { id: '1', name: 'João', surname: 'Silva', email: 'j@j.com', created_at: '', updated_at: '' },
}

beforeEach(() => {
  mockPush.mockReset()
  mockLogin.mockReset()
  mockSetSession.mockReset()
  mockGet.mockReturnValue(null)
})

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })

  it('shows error when fields are empty — no API call', async () => {
    render(<LoginForm />)
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(await screen.findByText('Preencha o e-mail e a senha.')).toBeInTheDocument()
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('calls login and redirects to /groups on success when no returnUrl', async () => {
    mockLogin.mockResolvedValue(mockSession)
    render(<LoginForm />)
    await userEvent.type(screen.getByLabelText('E-mail'), 'joao@example.com')
    await userEvent.type(screen.getByLabelText('Senha'), 'senha123')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    await waitFor(() => expect(mockLogin).toHaveBeenCalledTimes(1))
    expect(mockSetSession).toHaveBeenCalledWith(mockSession)
    expect(mockPush).toHaveBeenCalledWith('/groups')
  })

  it('redirects to returnUrl after login when present', async () => {
    mockLogin.mockResolvedValue(mockSession)
    mockGet.mockReturnValue('/invite/abc123')
    render(<LoginForm />)
    await userEvent.type(screen.getByLabelText('E-mail'), 'joao@example.com')
    await userEvent.type(screen.getByLabelText('Senha'), 'senha123')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/invite/abc123'))
  })

  it('shows "E-mail ou senha inválidos." on 401', async () => {
    mockLogin.mockRejectedValue(new UnauthorizedError('invalid credentials'))
    render(<LoginForm />)
    await userEvent.type(screen.getByLabelText('E-mail'), 'x@x.com')
    await userEvent.type(screen.getByLabelText('Senha'), 'wrongpass')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(await screen.findByText('E-mail ou senha inválidos.')).toBeInTheDocument()
  })

  it('shows generic error on unexpected failure', async () => {
    mockLogin.mockRejectedValue(new Error('network error'))
    render(<LoginForm />)
    await userEvent.type(screen.getByLabelText('E-mail'), 'x@x.com')
    await userEvent.type(screen.getByLabelText('Senha'), 'wrongpass')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(await screen.findByText('Ocorreu um erro. Tente novamente.')).toBeInTheDocument()
  })

  it('renders link to /register', () => {
    render(<LoginForm />)
    expect(screen.getByRole('link', { name: 'Criar conta' })).toHaveAttribute('href', '/register')
  })
})

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RegisterForm } from './RegisterForm'
import * as authService from '@/services/api/authService'
import * as auth from '@/lib/auth'
import { ConflictError } from '@/lib/errors'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

jest.mock('@/services/api/authService', () => ({ register: jest.fn() }))
jest.mock('@/lib/auth', () => ({ setSession: jest.fn() }))

const mockRegister = authService.register as jest.Mock
const mockSetSession = auth.setSession as jest.Mock

const mockSession = {
  access_token: 'jwt-token',
  token_type: 'Bearer' as const,
  expires_in: 3600,
  user: { id: '1', name: 'João', surname: 'Silva', email: 'j@j.com', created_at: '', updated_at: '' },
}

async function fillForm(overrides: Record<string, string> = {}) {
  const fields: Record<string, string> = {
    Nome: 'João',
    Sobrenome: 'Silva',
    'E-mail': 'joao@example.com',
    Senha: 'senha123',
    'Confirmação de senha': 'senha123',
    ...overrides,
  }
  for (const [label, value] of Object.entries(fields)) {
    const input = screen.getByLabelText(label)
    await userEvent.clear(input)
    if (value) await userEvent.type(input, value)
  }
}

beforeEach(() => {
  mockPush.mockReset()
  mockRegister.mockReset()
  mockSetSession.mockReset()
})

describe('RegisterForm', () => {
  it('renders all 5 fields', () => {
    render(<RegisterForm />)
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('Sobrenome')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirmação de senha')).toBeInTheDocument()
  })

  it('shows error when passwords do not match — no API call', async () => {
    render(<RegisterForm />)
    await fillForm({ 'Confirmação de senha': 'diferente' })
    await userEvent.click(screen.getByRole('button', { name: 'Criar conta' }))
    expect(await screen.findByText('As senhas não coincidem.')).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('shows error when fields are empty — no API call', async () => {
    render(<RegisterForm />)
    await userEvent.click(screen.getByRole('button', { name: 'Criar conta' }))
    expect(await screen.findByText('Todos os campos são obrigatórios.')).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('shows error when password is shorter than 8 characters — no API call', async () => {
    render(<RegisterForm />)
    await fillForm({ Senha: '123', 'Confirmação de senha': '123' })
    await userEvent.click(screen.getByRole('button', { name: 'Criar conta' }))
    expect(await screen.findByText('A senha deve ter no mínimo 8 caracteres.')).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('calls register and redirects to /groups on success', async () => {
    mockRegister.mockResolvedValue(mockSession)
    render(<RegisterForm />)
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: 'Criar conta' }))
    await waitFor(() => expect(mockRegister).toHaveBeenCalledTimes(1))
    expect(mockSetSession).toHaveBeenCalledWith(mockSession)
    expect(mockPush).toHaveBeenCalledWith('/groups')
  })

  it('shows "Este e-mail já está em uso." on conflict', async () => {
    mockRegister.mockRejectedValue(new ConflictError('email already in use'))
    render(<RegisterForm />)
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: 'Criar conta' }))
    expect(await screen.findByText('Este e-mail já está em uso.')).toBeInTheDocument()
  })

  it('shows generic error on unexpected failure', async () => {
    mockRegister.mockRejectedValue(new Error('network error'))
    render(<RegisterForm />)
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: 'Criar conta' }))
    expect(await screen.findByText('Ocorreu um erro. Tente novamente.')).toBeInTheDocument()
  })

  it('renders link to /login', () => {
    render(<RegisterForm />)
    expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute('href', '/login')
  })
})

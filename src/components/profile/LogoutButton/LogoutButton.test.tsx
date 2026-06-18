import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LogoutButton } from './LogoutButton'
import * as auth from '@/lib/auth'

jest.mock('@/lib/auth', () => ({
  clearToken: jest.fn(),
}))

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

const mockClearToken = auth.clearToken as jest.Mock

beforeEach(() => jest.clearAllMocks())

describe('LogoutButton', () => {
  it('renders a button with text "Sair"', () => {
    render(<LogoutButton />)
    expect(screen.getByRole('button', { name: /sair/i })).toBeInTheDocument()
  })

  it('clears token and redirects to /login on click', async () => {
    render(<LogoutButton />)
    await userEvent.click(screen.getByRole('button', { name: /sair/i }))
    expect(mockClearToken).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith('/login')
  })
})

import { render, screen } from '@testing-library/react'
import DashboardContent from './DashboardContent'

describe('DashboardContent', () => {
  it('renders "O melhor está por vir"', () => {
    render(<DashboardContent />)
    expect(screen.getByRole('heading', { name: 'O melhor está por vir' })).toBeInTheDocument()
  })

  it('renders supporting subtext', () => {
    render(<DashboardContent />)
    expect(screen.getByText(/amigo secreto/i)).toBeInTheDocument()
  })
})

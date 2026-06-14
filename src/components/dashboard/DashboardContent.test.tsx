import { render, screen } from '@testing-library/react'
import DashboardContent from './DashboardContent'

describe('DashboardContent', () => {
  it('renders Dashboard heading', () => {
    render(<DashboardContent />)
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('renders groups quick-access card linking to /groups', () => {
    render(<DashboardContent />)
    const link = screen.getByRole('link', { name: /grupos/i })
    expect(link).toHaveAttribute('href', '/groups')
  })

  it('renders groups card description mentioning Amigo Secreto', () => {
    render(<DashboardContent />)
    expect(screen.getByText(/amigo secreto/i)).toBeInTheDocument()
  })
})

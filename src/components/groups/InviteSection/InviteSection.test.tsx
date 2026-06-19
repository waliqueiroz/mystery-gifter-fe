import { render, screen } from '@testing-library/react'

import { InviteSection } from './InviteSection'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    className,
  }: {
    href: string
    children: React.ReactNode
    className?: string
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

describe('InviteSection', () => {
  it('renders link "Convidar participantes" for OPEN group', () => {
    render(<InviteSection groupId="g1" groupStatus="OPEN" />)
    const link = screen.getByRole('link', { name: /convidar participantes/i })
    expect(link).toHaveAttribute('href', '/groups/g1/invite')
  })

  it('button uses compact pill geometry (FR-009)', () => {
    render(<InviteSection groupId="g1" groupStatus="OPEN" />)
    const btn = screen.getByRole('button', { name: /convidar participantes/i })
    expect(btn).toHaveClass('rounded-pill')
  })

  it('renders null when group is MATCHED', () => {
    const { container } = render(
      <InviteSection groupId="g1" groupStatus="MATCHED" />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders null when group is ARCHIVED', () => {
    const { container } = render(
      <InviteSection groupId="g1" groupStatus="ARCHIVED" />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('includes link icon as decoration', () => {
    const { container } = render(
      <InviteSection groupId="g1" groupStatus="OPEN" />,
    )
    expect(container.querySelector('svg')).not.toBeNull()
  })
})

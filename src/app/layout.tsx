import type { Metadata } from 'next'
import { Manrope, Noto_Sans } from 'next/font/google'
import './globals.css'

/*
 * Fontes do produto, carregadas via next/font/google (FR-011):
 *
 * - Manrope: família principal — herdeira espiritual da Circular do DESIGN.md,
 *   geométrica e levemente humanista. Cobre Latin + Latin-ext.
 * - Noto Sans: cobertura adicional de Cyrillic e Greek; em futuras
 *   internacionalizações é trivial adicionar Noto_Sans_Arabic, _Hebrew, _SC.
 *
 * Ambas auto-self-hospedam no domínio do produto (sem requisições externas
 * em runtime). Os pesos 400/600/700 cobrem corpo, semibold e negrito conforme
 * DESIGN.md §3.
 */
const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-manrope',
})

const notoSans = Noto_Sans({
  subsets: ['latin', 'cyrillic', 'greek'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-noto-sans',
})

export const metadata: Metadata = {
  title: 'Mystery Gifter',
  description: 'Gerencie seus grupos de amigo secreto com facilidade.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${notoSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}

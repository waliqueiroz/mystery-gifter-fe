import Link from 'next/link'

import Button from '@/components/ui/Button/Button'
import { Icon, type IconName } from '@/components/ui/Icon/Icon'
import { cn } from '@/lib/cn'

interface Feature {
  icon: IconName
  title: string
  description: string
}

const FEATURES: readonly Feature[] = [
  {
    icon: 'Users',
    title: 'Crie grupos',
    description: 'Monte seu grupo de amigo secreto em segundos.',
  },
  {
    icon: 'Shuffle',
    title: 'Sorteie nomes',
    description: 'Sorteio automático e justo para todos os participantes.',
  },
  {
    icon: 'CircleCheck',
    title: 'Gerencie tudo',
    description: 'Acompanhe grupos e participantes em um só lugar.',
  },
] as const

export default function HeroSection() {
  return (
    <section
      className={cn(
        'flex min-h-dvh flex-col items-center justify-center bg-mg-bg px-4 py-12',
      )}
    >
      <div className="mx-auto flex w-full max-w-app flex-col items-center text-center">
        <div
          aria-hidden="true"
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-mg-surface-2 text-mg-green"
        >
          <Icon name="Gift" size={40} />
        </div>

        <h1 className="text-3xl font-bold text-mg-text sm:text-4xl">
          Mystery Gifter
        </h1>

        <p className="mt-3 text-base text-mg-text-muted">
          Organize grupos de amigo secreto de forma simples e divertida.
          Crie grupos, sorteie participantes e gerencie tudo em um só lugar.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <Link href="/login" className="contents">
            <Button variant="primary" shape="pill-lg" size="lg" className="w-full sm:w-auto sm:min-w-40">
              Entrar
            </Button>
          </Link>
          <Link href="/register" className="contents">
            <Button variant="outline" shape="pill-lg" size="lg" className="w-full sm:w-auto sm:min-w-40">
              Criar conta
            </Button>
          </Link>
        </div>

        <ul className="mt-12 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <li
              key={feature.title}
              className="flex flex-col items-center gap-2 rounded-card bg-mg-surface p-4 text-center"
            >
              <Icon
                name={feature.icon}
                size={28}
                className="text-mg-text-muted"
              />
              <h2 className="text-sm font-bold text-mg-text">
                {feature.title}
              </h2>
              <p className="text-xs text-mg-text-muted">
                {feature.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

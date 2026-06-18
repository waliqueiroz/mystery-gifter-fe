'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

type Phase = 'idle' | 'start' | 'running' | 'done'

export function NavigationProgress() {
  const pathname = usePathname()
  const [phase, setPhase] = useState<Phase>('idle')
  const doneTimer = useRef<ReturnType<typeof setTimeout>>()
  const rafRef = useRef<number>()

  useEffect(() => {
    clearTimeout(doneTimer.current)
    cancelAnimationFrame(rafRef.current!)
    if (phase === 'running' || phase === 'start') {
      setPhase('done')
      doneTimer.current = setTimeout(() => setPhase('idle'), 400)
    }
    // Só reagir quando pathname muda (navegação concluída)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href]')
      if (!a || a.target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey) return
      try {
        const url = new URL(a.href)
        if (url.origin !== location.origin) return
        if (url.pathname === location.pathname) return
        clearTimeout(doneTimer.current)
        setPhase('start')
        // Próximo frame: inicia animação (necessário para a transição CSS partir do 0%)
        rafRef.current = requestAnimationFrame(() => setPhase('running'))
      } catch { /* href inválido ou externo */ }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const width =
    phase === 'idle' ? '0%'
    : phase === 'start' ? '0%'
    : phase === 'running' ? '70%'
    : '100%'

  const transitionStyle =
    phase === 'running'
      ? 'width 2s ease-out'
      : phase === 'done'
      ? 'width 200ms ease-in'
      : 'none'

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px]"
      style={{ opacity: phase === 'idle' ? 0 : 1 }}
    >
      <div
        data-testid="nav-progress-bar"
        className="h-full bg-mg-green"
        style={{ width, transition: transitionStyle }}
      />
    </div>
  )
}

import { useEffect, useState } from 'react'

/**
 * Retorna `true` somente após `value === true` ter persistido por `delayMs`.
 * Se `value` voltar a `false` antes do timer disparar, o flag NÃO ativa.
 *
 * Uso típico: evitar flash de skeleton em respostas rápidas — segura o render
 * por ~150 ms; se os dados chegarem antes, o usuário nem vê o skeleton.
 *
 * Exemplo:
 *   const { data, loading } = useGroups()
 *   const showSkeleton = useDelayedFlag(loading, 150)
 *   if (showSkeleton) return <SkeletonList />
 */
export function useDelayedFlag(value: boolean, delayMs: number): boolean {
  const [flag, setFlag] = useState(false)

  useEffect(() => {
    if (!value) {
      setFlag(false)
      return
    }

    const timer = setTimeout(() => {
      setFlag(true)
    }, delayMs)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delayMs])

  return flag
}

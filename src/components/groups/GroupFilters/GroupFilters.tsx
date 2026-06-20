'use client'

import { useEffect, useRef, useState } from 'react'

import { FormField } from '@/components/ui/FormField/FormField'
import { Icon } from '@/components/ui/Icon/Icon'
import { cn } from '@/lib/cn'
import type { GroupFilterParams, GroupStatus } from '@/types/api'

interface GroupFiltersProps {
  filters: GroupFilterParams
  onChange: (filters: GroupFilterParams) => void
}

const STATUS_OPTIONS: readonly { value: GroupStatus; label: string }[] = [
  { value: 'OPEN', label: 'Aberto' },
  { value: 'MATCHED', label: 'Sorteado' },
  { value: 'ARCHIVED', label: 'Arquivado' },
] as const

const NAME_DEBOUNCE_MS = 400

export function GroupFilters({ filters, onChange }: GroupFiltersProps) {
  const [nameValue, setNameValue] = useState(filters.name)
  const latestFiltersRef = useRef(filters)

  // Mantém a ref sempre atualizada para o timer disparado pelo debounce
  // sempre ler os statuses/sortDirection mais recentes.
  useEffect(() => {
    latestFiltersRef.current = filters
  })

  // Sincroniza o input quando o pai zera filters.name externamente.
  useEffect(() => {
    setNameValue(filters.name)
  }, [filters.name])

  // Dispara onChange só depois do usuário parar de digitar por NAME_DEBOUNCE_MS.
  useEffect(() => {
    if (nameValue === latestFiltersRef.current.name) return
    const timer = setTimeout(() => {
      onChange({ ...latestFiltersRef.current, name: nameValue })
    }, NAME_DEBOUNCE_MS)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameValue])

  function toggleStatus(value: GroupStatus) {
    const next = filters.statuses.includes(value)
      ? filters.statuses.filter((s) => s !== value)
      : [...filters.statuses, value]
    onChange({ ...filters, statuses: next })
  }

  function setSort(direction: 'ASC' | 'DESC') {
    if (filters.sortDirection === direction) return
    onChange({ ...filters, sortDirection: direction })
  }

  return (
    <div className="flex flex-col gap-4">
      <FormField
        id="group-search"
        label="Buscar por nome"
        type="search"
        value={nameValue}
        onChange={setNameValue}
        placeholder="Nome do grupo..."
      />

      <fieldset className="flex flex-col gap-2">
        <legend className="text-xs font-semibold uppercase tracking-btn text-mg-text-muted">
          Status
        </legend>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtro de status">
          {STATUS_OPTIONS.map(({ value, label }) => {
            const active = filters.statuses.includes(value)
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => toggleStatus(value)}
                className={cn(
                  'inline-flex items-center gap-1 rounded-pill px-3 py-1.5 text-xs font-semibold transition-colors',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-mg-green focus-visible:outline-offset-2',
                  active
                    ? 'bg-mg-green/15 text-mg-green'
                    : 'bg-mg-surface-2 text-mg-text-muted hover:text-mg-text',
                )}
              >
                {active && <Icon name="Check" size={12} aria-hidden />}
                {label}
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-xs font-semibold uppercase tracking-btn text-mg-text-muted">
          Ordenar por
        </legend>
        <div className="flex gap-2" role="group" aria-label="Ordenação">
          {([
            { value: 'DESC', label: 'Mais recentes' },
            { value: 'ASC', label: 'Mais antigos' },
          ] as const).map(({ value, label }) => {
            const active = filters.sortDirection === value
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => setSort(value)}
                className={cn(
                  'rounded-pill px-3 py-1.5 text-xs font-semibold transition-colors',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-mg-green focus-visible:outline-offset-2',
                  active
                    ? 'bg-mg-green/15 text-mg-green'
                    : 'bg-mg-surface-2 text-mg-text-muted hover:text-mg-text',
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}

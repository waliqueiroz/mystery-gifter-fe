'use client'

import { useEffect, useRef, useState } from 'react'
import type { GroupFilterParams, GroupStatus } from '@/types/api'

interface GroupFiltersProps {
  filters: GroupFilterParams
  onChange: (filters: GroupFilterParams) => void
}

const STATUS_OPTIONS: { value: GroupStatus; label: string }[] = [
  { value: 'OPEN', label: 'Aberto' },
  { value: 'MATCHED', label: 'Sorteado' },
  { value: 'ARCHIVED', label: 'Arquivado' },
]

const NAME_DEBOUNCE_MS = 400

export function GroupFilters({ filters, onChange }: GroupFiltersProps) {
  const [nameValue, setNameValue] = useState(filters.name)
  const latestFiltersRef = useRef(filters)

  // Keep the ref current on every render so the debounce timer always
  // reads the latest statuses/sortDirection when it fires.
  useEffect(() => {
    latestFiltersRef.current = filters
  })

  // If the parent resets filters.name externally, sync the input.
  useEffect(() => {
    setNameValue(filters.name)
  }, [filters.name])

  // Fire onChange only after the user stops typing for NAME_DEBOUNCE_MS.
  useEffect(() => {
    if (nameValue === latestFiltersRef.current.name) return
    const timer = setTimeout(() => {
      onChange({ ...latestFiltersRef.current, name: nameValue })
    }, NAME_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [nameValue]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleStatusToggle(value: GroupStatus) {
    const next = filters.statuses.includes(value)
      ? filters.statuses.filter((s) => s !== value)
      : [...filters.statuses, value]
    onChange({ ...filters, statuses: next })
  }

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    onChange({ ...filters, sortDirection: e.target.value as 'ASC' | 'DESC' })
  }

  return (
    <div className="mb-3">
      <div className="row g-2 align-items-end">
        <div className="col-12 col-md-5">
          <label
            htmlFor="group-search"
            className="form-label"
            style={{ color: 'var(--mg-text-muted)', fontSize: '0.8rem' }}
          >
            Buscar por nome
          </label>
          <input
            id="group-search"
            type="text"
            className="form-control"
            placeholder="Nome do grupo..."
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
          />
        </div>

        <div className="col-12 col-md-4">
          <fieldset>
            <legend
              className="form-label mb-1"
              style={{ color: 'var(--mg-text-muted)', fontSize: '0.8rem' }}
            >
              Status
            </legend>
            <div className="d-flex gap-3 flex-wrap">
              {STATUS_OPTIONS.map(({ value, label }) => (
                <div key={value} className="form-check form-check-inline mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`status-${value}`}
                    checked={filters.statuses.includes(value)}
                    onChange={() => handleStatusToggle(value)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`status-${value}`}
                    style={{ color: 'var(--mg-text)', fontSize: '0.875rem' }}
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="col-12 col-md-3">
          <label
            htmlFor="group-sort"
            className="form-label"
            style={{ color: 'var(--mg-text-muted)', fontSize: '0.8rem' }}
          >
            Ordenar por
          </label>
          <select
            id="group-sort"
            className="form-control"
            value={filters.sortDirection}
            onChange={handleSortChange}
          >
            <option value="DESC">Mais recentes</option>
            <option value="ASC">Mais antigos</option>
          </select>
        </div>
      </div>
    </div>
  )
}

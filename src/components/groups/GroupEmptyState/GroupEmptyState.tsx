'use client'

import { EmptyState } from '@/components/ui/EmptyState/EmptyState'
import { Icon } from '@/components/ui/Icon/Icon'

interface GroupEmptyStateProps {
  onCreateClick: () => void
}

/**
 * Wrapper de domínio sobre `<EmptyState />` (FR-025) com a cópia específica
 * da lista de grupos vazia. Mantém o callback do CTA por compatibilidade com
 * o consumidor atual (`GroupList`); quando a rota `/groups/new` entrar em
 * Phase 6B, este componente pode ser substituído por `<EmptyState />`
 * inline na chamada com `cta={{ href: '/groups/new' }}`.
 */
export function GroupEmptyState({ onCreateClick }: GroupEmptyStateProps) {
  return (
    <EmptyState
      icon={<Icon name="Gift" size={28} />}
      title="Nenhum grupo ainda"
      description="Crie seu primeiro grupo de Amigo Secreto e comece a sortear!"
      cta={{ label: 'Criar grupo', onClick: onCreateClick }}
    />
  )
}

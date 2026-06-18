import { EmptyState } from '@/components/ui/EmptyState/EmptyState'
import { Icon } from '@/components/ui/Icon/Icon'

/**
 * Wrapper de domínio sobre `<EmptyState />` (FR-025) com a cópia específica
 * da lista de grupos vazia. O CTA aponta para a rota dedicada `/groups/new`
 * (Q2 + FR-023) — antes era um callback que abria modal; agora é navegação.
 */
export function GroupEmptyState() {
  return (
    <EmptyState
      icon={<Icon name="Gift" size={28} />}
      title="Nenhum grupo ainda"
      description="Crie seu primeiro grupo de Amigo Secreto e comece a sortear!"
      cta={{ label: 'Criar grupo', href: '/groups/new' }}
    />
  )
}

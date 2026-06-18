'use client'

import Link from 'next/link'

import Button from '@/components/ui/Button/Button'
import { Icon } from '@/components/ui/Icon/Icon'
import type { GroupStatus } from '@/types/api'

interface InviteSectionProps {
  groupId: string
  groupStatus: GroupStatus
}

/**
 * Botão de navegação que leva à rota dedicada de convites
 * `/groups/[id]/invite` (FR-023 + Q2 — fluxo com formulário/multi-passos
 * usa rota dedicada, não modal/overlay inline).
 *
 * Para grupos já sorteados (MATCHED) ou arquivados (ARCHIVED), o convite
 * não faz sentido e o componente renderiza null (mesma regra do legado).
 *
 * Antes deste refactor, a `InviteSection` carregava o convite ativo, exibia
 * URL + botões Copiar/Compartilhar e oferecia o "Gerar link" — tudo inline
 * dentro do detalhe do grupo. Essa lógica agora vive em
 * `src/app/(protected)/groups/[id]/invite/page.tsx`.
 */
export function InviteSection({ groupId, groupStatus }: InviteSectionProps) {
  if (groupStatus === 'MATCHED' || groupStatus === 'ARCHIVED') {
    return null
  }

  return (
    <Link href={`/groups/${groupId}/invite`} className="contents">
      <Button
        type="button"
        variant="outline"
        shape="pill"
        size="sm"
        iconLeft={<Icon name="Link" size={14} />}
      >
        Convidar participantes
      </Button>
    </Link>
  )
}

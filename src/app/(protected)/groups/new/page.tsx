'use client'

import { useRouter } from 'next/navigation'

import { CreateGroupForm } from '@/components/groups/CreateGroupForm/CreateGroupForm'
import { useToast } from '@/hooks/useToast'
import type { Group } from '@/types/api'

export default function NewGroupPage() {
  const router = useRouter()
  const { showToast } = useToast()

  function handleSuccess(group: Group) {
    showToast({ message: 'Grupo criado com sucesso!', type: 'success' })
    router.push(`/groups/${group.id}`)
  }

  function handleCancel() {
    router.push('/groups')
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-mg-text">Criar grupo</h1>
      <CreateGroupForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  )
}

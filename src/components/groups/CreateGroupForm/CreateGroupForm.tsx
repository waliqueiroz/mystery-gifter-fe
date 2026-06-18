'use client'

import { useState } from 'react'

import Button from '@/components/ui/Button/Button'
import FormField from '@/components/ui/FormField/FormField'
import { useToast } from '@/components/ui/Toast/useToast'
import { cn } from '@/lib/cn'
import { createGroup } from '@/services/api/groupService'
import type { Group } from '@/types/api'
import type { CreateGroupFormData } from '@/types/forms'

interface CreateGroupFormProps {
  /** Callback chamado após criação bem-sucedida — em geral redirect ou push de toast. */
  onSuccess: (group: Group) => void
  /** Ação do botão "Cancelar" — em geral router.back() ou navegação. */
  onCancel: () => void
}

const EMPTY_FORM: CreateGroupFormData = { name: '', description: '' }

const TEXTAREA_CLASSES = cn(
  'min-h-[96px] w-full resize-none rounded-card bg-mg-surface-2 px-5 py-3 text-base text-mg-text',
  'placeholder:text-mg-text-muted',
  'shadow-mg-inset',
  'focus:outline-none focus-visible:outline-2 focus-visible:outline focus-visible:outline-mg-green focus-visible:outline-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-60',
)

/**
 * Formulário de criação de grupo puro — sem chassi de modal, sem overlay.
 * Consumido pela rota dedicada `/groups/new`.
 *
 * A migração da UI de modal para rota é exigência da clarificação Q2 + FR-023
 * (modais só para confirmação); a rota dedicada suporta back do navegador e
 * preserva o estado na URL.
 */
export function CreateGroupForm({ onSuccess, onCancel }: CreateGroupFormProps) {
  const { showToast } = useToast()
  const [form, setForm] = useState<CreateGroupFormData>(EMPTY_FORM)
  const [nameError, setNameError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(field: keyof CreateGroupFormData) {
    return (value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }))
      if (field === 'name') setNameError('')
    }
  }

  function validate(): boolean {
    if (!form.name.trim()) {
      setNameError('O nome do grupo é obrigatório.')
      return false
    }
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const group = await createGroup({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
      })
      setForm(EMPTY_FORM)
      onSuccess(group)
    } catch (err) {
      showToast({
        message:
          err instanceof Error
            ? err.message
            : 'Ocorreu um erro. Tente novamente.',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <FormField
        id="group-name"
        label="Nome do grupo"
        type="text"
        value={form.name}
        onChange={handleChange('name')}
        placeholder="Ex: Amigo Secreto da Família"
        required
        error={nameError}
      />

      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <label
            htmlFor="group-description"
            className="text-sm font-semibold text-mg-text-muted"
          >
            Descrição
          </label>
          <span className="text-xs text-mg-text-muted">(opcional)</span>
        </div>
        <textarea
          id="group-description"
          rows={3}
          maxLength={255}
          value={form.description}
          onChange={(e) => handleChange('description')(e.target.value)}
          placeholder="Descreva o tema ou regras do seu grupo"
          className={TEXTAREA_CLASSES}
          disabled={loading}
        />
      </div>

      <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="ghost"
          shape="pill-lg"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" shape="pill-lg" loading={loading}>
          Criar grupo
        </Button>
      </div>
    </form>
  )
}

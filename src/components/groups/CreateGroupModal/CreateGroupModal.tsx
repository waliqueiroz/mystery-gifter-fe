'use client'

import { useState } from 'react'
import type { Group } from '@/types/api'
import type { CreateGroupFormData } from '@/types/forms'
import { createGroup } from '@/services/api/groupService'
import FormField from '@/components/ui/FormField/FormField'
import Button from '@/components/ui/Button/Button'
import { useToast } from '@/components/ui/Toast/useToast'

interface CreateGroupModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (group: Group) => void
}

const EMPTY_FORM: CreateGroupFormData = { name: '', description: '' }

export function CreateGroupModal({ isOpen, onClose, onSuccess }: CreateGroupModalProps) {
  const { showToast } = useToast()
  const [form, setForm] = useState<CreateGroupFormData>(EMPTY_FORM)
  const [nameError, setNameError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

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
      onClose()
    } catch (err) {
      showToast({
        message: err instanceof Error ? err.message : 'Ocorreu um erro. Tente novamente.',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="modal d-block"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-group-title"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content"
          style={{ backgroundColor: 'var(--mg-bg-card)', color: 'var(--mg-text)', border: 'none' }}
        >
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title" id="create-group-title">
              Criar grupo
            </h5>
            <button
              type="button"
              className="close text-white"
              aria-label="Fechar"
              onClick={onClose}
            >
              <i className="fas fa-times" aria-hidden="true" />
            </button>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body">
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
              <div className="form-group">
                <label htmlFor="group-description">
                  Descrição <span style={{ color: 'var(--mg-text-muted)' }}>(opcional)</span>
                </label>
                <textarea
                  id="group-description"
                  className="form-control"
                  rows={3}
                  maxLength={255}
                  value={form.description}
                  onChange={(e) => handleChange('description')(e.target.value)}
                  placeholder="Descreva o tema ou regras do seu grupo"
                  style={{ backgroundColor: 'var(--mg-bg-secondary)', color: 'var(--mg-text)', border: '1px solid rgba(107,70,193,0.3)', resize: 'none' }}
                />
              </div>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <Button type="submit" loading={loading}>
                Criar grupo
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

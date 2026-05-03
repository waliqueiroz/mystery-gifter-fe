'use client'

interface GroupEmptyStateProps {
  onCreateClick: () => void
}

export function GroupEmptyState({ onCreateClick }: GroupEmptyStateProps) {
  return (
    <div className="text-center py-5">
      <i
        className="fas fa-gift fa-4x mb-4"
        style={{ color: 'var(--mg-primary-hover)' }}
        aria-hidden="true"
      />
      <h4 className="mb-2" style={{ color: 'var(--mg-text)' }}>
        Nenhum grupo ainda
      </h4>
      <p className="mb-4" style={{ color: 'var(--mg-text-muted)' }}>
        Crie seu primeiro grupo de Amigo Secreto e comece a sorteios!
      </p>
      <button type="button" className="btn btn-primary" onClick={onCreateClick}>
        <i className="fas fa-plus mr-2" aria-hidden="true" />
        Criar grupo
      </button>
    </div>
  )
}

import Link from 'next/link'

export default function DashboardContent() {
  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0" style={{ color: 'var(--mg-text)' }}>
                Dashboard
              </h1>
            </div>
          </div>
        </div>
      </div>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6">
              <Link href="/groups" className="text-decoration-none">
                <div
                  className="card mg-dashboard-card"
                  style={{
                    backgroundColor: 'var(--mg-bg-card)',
                    border: '1px solid rgba(107,70,193,0.3)',
                    cursor: 'pointer',
                  }}
                >
                  <div className="card-body text-center py-4">
                    <i
                      className="fas fa-users fa-3x mb-3"
                      style={{ color: 'var(--mg-primary-hover)' }}
                      aria-hidden="true"
                    />
                    <h5 className="mb-1" style={{ color: 'var(--mg-text)' }}>
                      Grupos
                    </h5>
                    <p className="mb-0 small" style={{ color: 'var(--mg-text-muted)' }}>
                      Gerencie seus grupos de Amigo Secreto
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

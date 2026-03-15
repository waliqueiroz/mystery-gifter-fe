import Link from 'next/link'

export default function HeroSection() {
  return (
    <div className="mg-hero d-flex flex-column align-items-center justify-content-center">
      <div className="text-center px-3">
        <i className="fas fa-gift mg-hero-icon mb-4" aria-hidden="true" />
        <h1 className="mg-hero-title display-4 font-weight-bold mb-3">Mystery Gifter</h1>
        <p className="lead mb-5">
          Organize grupos de amigo secreto de forma simples e divertida. Crie grupos, sorteie
          participantes e gerencie tudo em um só lugar.
        </p>
        <div className="d-flex justify-content-center gap-3 mb-5">
          <Link href="/login" className="btn btn-primary btn-lg mr-3">
            Entrar
          </Link>
          <Link href="/register" className="btn btn-outline-primary btn-lg">
            Criar conta
          </Link>
        </div>
        <div className="row justify-content-center">
          <div className="col-10 col-sm-8 col-md-3">
            <div className="mg-feature-card">
              <i className="fas fa-users fa-2x mb-3" aria-hidden="true" />
              <h5 className="font-weight-bold">Crie grupos</h5>
              <p className="small mb-0">Monte seu grupo de amigo secreto em segundos</p>
            </div>
          </div>
          <div className="col-10 col-sm-8 col-md-3 mt-3 mt-md-0">
            <div className="mg-feature-card">
              <i className="fas fa-random fa-2x mb-3" aria-hidden="true" />
              <h5 className="font-weight-bold">Sorteie nomes</h5>
              <p className="small mb-0">Sorteio automático e justo para todos os participantes</p>
            </div>
          </div>
          <div className="col-10 col-sm-8 col-md-3 mt-3 mt-md-0">
            <div className="mg-feature-card">
              <i className="fas fa-check-circle fa-2x mb-3" aria-hidden="true" />
              <h5 className="font-weight-bold">Gerencie tudo</h5>
              <p className="small mb-0">Acompanhe grupos e participantes em um só lugar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

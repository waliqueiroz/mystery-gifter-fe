import Link from 'next/link'

export default function HeroSection() {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div className="text-center">
        <h1 className="display-4 font-weight-bold mb-3">Mystery Gifter</h1>
        <p className="lead mb-5">
          Organize grupos de amigo secreto de forma simples e divertida. Crie grupos, sorteie
          participantes e gerencie tudo em um só lugar.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link href="/login" className="btn btn-primary btn-lg mr-3">
            Entrar
          </Link>
          <Link href="/register" className="btn btn-outline-primary btn-lg">
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  )
}

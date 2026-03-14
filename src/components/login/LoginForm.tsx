'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import FormField from '@/components/ui/FormField/FormField'
import Button from '@/components/ui/Button/Button'
import { login } from '@/services/api/authService'
import { setToken } from '@/lib/auth'
import type { LoginFormData } from '@/types/forms'

export default function LoginForm() {
  const router = useRouter()
  const [form, setForm] = useState<LoginFormData>({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(field: keyof LoginFormData) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Preencha o e-mail e a senha.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const session = await login({ email: form.email, password: form.password })
      setToken(session.access_token)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card" style={{ width: '100%', maxWidth: 420 }}>
        <div className="card-body p-5">
          <h1 className="text-center mb-4">Entrar</h1>
          <form onSubmit={handleSubmit} noValidate>
            {error && <div className="alert alert-danger">{error}</div>}
            <FormField
              id="email"
              label="E-mail"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="seu@email.com"
              required
            />
            <FormField
              id="password"
              label="Senha"
              type="password"
              value={form.password}
              onChange={handleChange('password')}
              placeholder="Sua senha"
              required
            />
            <Button type="submit" loading={loading} className="btn-block mt-3">
              Entrar
            </Button>
          </form>
          <p className="text-center mt-3 mb-0">
            Não tem conta?{' '}
            <Link href="/register">Criar conta</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

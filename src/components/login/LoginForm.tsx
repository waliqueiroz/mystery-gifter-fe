'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import Button from '@/components/ui/Button/Button'
import { ErrorAlert } from '@/components/ui/ErrorAlert/ErrorAlert'
import FormField from '@/components/ui/FormField/FormField'
import { setSession } from '@/lib/auth'
import { UnauthorizedError } from '@/lib/errors'
import { login } from '@/services/api/authService'
import type { LoginFormData } from '@/types/forms'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [form, setForm] = useState<LoginFormData>({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(field: keyof LoginFormData) {
    return (value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }))
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
      const session = await login({
        email: form.email,
        password: form.password,
      })
      setSession(session)
      const returnUrl = searchParams.get('returnUrl')
      router.push(returnUrl ?? '/groups')
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        setError('E-mail ou senha inválidos.')
      } else {
        setError('Ocorreu um erro. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-mg-bg px-4 py-12">
      <div className="w-full max-w-md rounded-card bg-mg-surface p-8 shadow-mg-card">
        <h1 className="text-2xl font-bold text-mg-text">Entrar</h1>

        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
          {error && <ErrorAlert message={error} />}

          <FormField
            id="email"
            label="E-mail"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="seu@email.com"
            autoComplete="email"
            required
          />
          <FormField
            id="password"
            label="Senha"
            type="password"
            value={form.password}
            onChange={handleChange('password')}
            placeholder="Sua senha"
            autoComplete="current-password"
            required
          />
          <Button type="submit" loading={loading} className="mt-2">
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-mg-text-muted">
          Não tem conta?{' '}
          <Link
            href="/register"
            className="font-semibold text-mg-green hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-mg-green focus-visible:outline-offset-2"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  )
}

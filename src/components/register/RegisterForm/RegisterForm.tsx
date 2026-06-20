'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/Button/Button'
import { ErrorAlert } from '@/components/ui/ErrorAlert/ErrorAlert'
import { FormField } from '@/components/ui/FormField/FormField'
import { setSession } from '@/lib/auth'
import { ConflictError } from '@/lib/errors'
import { register } from '@/services/api/authService'
import type { RegisterFormData } from '@/types/forms'

export function RegisterForm() {
  const router = useRouter()
  const [form, setForm] = useState<RegisterFormData>({
    name: '',
    surname: '',
    email: '',
    password: '',
    passwordConfirm: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(field: keyof RegisterFormData) {
    return (value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }))
    }
  }

  function validate(): string {
    if (
      !form.name ||
      !form.surname ||
      !form.email ||
      !form.password ||
      !form.passwordConfirm
    ) {
      return 'Todos os campos são obrigatórios.'
    }
    if (form.password.length < 8) {
      return 'A senha deve ter no mínimo 8 caracteres.'
    }
    if (form.password !== form.passwordConfirm) {
      return 'As senhas não coincidem.'
    }
    return ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setLoading(true)
    setError('')
    try {
      const session = await register({
        name: form.name,
        surname: form.surname,
        email: form.email,
        password: form.password,
        password_confirm: form.passwordConfirm,
      })
      setSession(session)
      router.push('/groups')
    } catch (err) {
      if (err instanceof ConflictError) {
        setError('Este e-mail já está em uso.')
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
        <h1 className="text-2xl font-bold text-mg-text">Criar conta</h1>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 flex flex-col gap-4"
        >
          {error && <ErrorAlert message={error} />}

          <FormField
            id="name"
            label="Nome"
            value={form.name}
            onChange={handleChange('name')}
            placeholder="Seu nome"
            autoComplete="given-name"
            required
          />
          <FormField
            id="surname"
            label="Sobrenome"
            value={form.surname}
            onChange={handleChange('surname')}
            placeholder="Seu sobrenome"
            autoComplete="family-name"
            required
          />
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
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            required
          />
          <FormField
            id="passwordConfirm"
            label="Confirmação de senha"
            type="password"
            value={form.passwordConfirm}
            onChange={handleChange('passwordConfirm')}
            placeholder="Repita a senha"
            autoComplete="new-password"
            required
          />
          <Button type="submit" loading={loading} className="mt-2">
            Criar conta
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-mg-text-muted">
          Já tem conta?{' '}
          <Link
            href="/login"
            className="font-semibold text-mg-green hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-mg-green focus-visible:outline-offset-2"
          >
            Entrar
          </Link>
        </p>
      </div>
    </main>
  )
}

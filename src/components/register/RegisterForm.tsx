'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import FormField from '@/components/ui/FormField/FormField'
import Button from '@/components/ui/Button/Button'
import { register } from '@/services/api/authService'
import { setToken } from '@/lib/auth'
import type { RegisterFormData } from '@/types/forms'

export default function RegisterForm() {
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
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }
  }

  function validate(): string {
    if (!form.name || !form.surname || !form.email || !form.password || !form.passwordConfirm) {
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
      <div className="card" style={{ width: '100%', maxWidth: 480 }}>
        <div className="card-body p-5">
          <h1 className="text-center mb-4">Criar conta</h1>
          <form onSubmit={handleSubmit} noValidate>
            {error && <div className="alert alert-danger">{error}</div>}
            <FormField
              id="name"
              label="Nome"
              value={form.name}
              onChange={handleChange('name')}
              placeholder="Seu nome"
              required
            />
            <FormField
              id="surname"
              label="Sobrenome"
              value={form.surname}
              onChange={handleChange('surname')}
              placeholder="Seu sobrenome"
              required
            />
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
              placeholder="Mínimo 8 caracteres"
              required
            />
            <FormField
              id="passwordConfirm"
              label="Confirmação de senha"
              type="password"
              value={form.passwordConfirm}
              onChange={handleChange('passwordConfirm')}
              placeholder="Repita a senha"
              required
            />
            <Button type="submit" loading={loading} className="btn-block mt-3">
              Criar conta
            </Button>
          </form>
          <p className="text-center mt-3 mb-0">
            Já tem conta?{' '}
            <Link href="/login">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Card } from '@tremor/react'
import { Building2, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  })

  // Carregar credenciais salvas ao montar o componente
  useEffect(() => {
    const savedCredentials = localStorage.getItem('savedCredentials')
    if (savedCredentials) {
      const { email, password } = JSON.parse(savedCredentials)
      setCredentials({ email, password })
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Salvar ou remover credenciais baseado no checkbox
    if (rememberMe) {
      localStorage.setItem('savedCredentials', JSON.stringify({ email, password }))
    } else {
      localStorage.removeItem('savedCredentials')
    }

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Credenciais inválidas')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      setError('Ocorreu um erro. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="flex flex-col items-center space-y-2">
          <div className="rounded-full bg-slate-800 p-2 ring-2 ring-slate-700">
            <Building2 className="h-8 w-8 text-slate-200" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-200">
            WebApp FGTS Admin
          </h1>
          <p className="text-sm text-slate-400">
            Faça login para acessar o painel administrativo
          </p>
        </div>

        <Card className="p-6 bg-slate-800/50 border border-slate-700 shadow-xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-200">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    className="block w-full rounded-md border-slate-700 bg-slate-800 text-slate-200 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-200">
                  Senha
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="block w-full rounded-md border-slate-700 bg-slate-800 text-slate-200 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm transition-colors pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-200">
                  Lembrar minhas credenciais
                </label>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-900/50 p-3">
                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-red-400" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
            >
              Entrar
            </button>
          </form>
        </Card>
      </div>
    </div>
  )
} 
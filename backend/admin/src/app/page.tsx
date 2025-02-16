'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Página raiz que redireciona para a página de login
export default function HomePage() {
  const router = useRouter()

  // Efeito que redireciona para /login assim que a página carrega
  useEffect(() => {
    router.push('/login')
  }, [router])

  // Retorna null pois a página será redirecionada
  return null
} 
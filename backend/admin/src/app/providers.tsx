'use client'

import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

// Componente que fornece os contextos necessários para a aplicação
export function Providers({ children }: ProvidersProps) {
  return (
    // SessionProvider do NextAuth.js para gerenciamento de autenticação
    <SessionProvider>
      {children}
    </SessionProvider>
  )
} 
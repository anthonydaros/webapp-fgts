'use client'

import { SessionProvider } from 'next-auth/react'

// Componente que fornece os contextos necessários para a aplicação
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // SessionProvider do NextAuth.js para gerenciamento de autenticação
    <SessionProvider>
      {children}
    </SessionProvider>
  )
} 
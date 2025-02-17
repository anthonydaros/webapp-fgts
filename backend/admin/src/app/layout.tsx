import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

// Configuração da fonte Inter do Google Fonts
const inter = Inter({ subsets: ['latin'] })

// Metadados da aplicação para SEO e configurações gerais
export const metadata: Metadata = {
  // Título da aplicação que aparece na aba do navegador
  title: 'WebApp FGTS Admin',
  // Descrição para SEO
  description: 'Painel administrativo do WebApp FGTS',
  // Configuração de ícones
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
    ],
  },
}

// Layout raiz da aplicação que envolve todas as páginas
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Define o idioma e aplica classes base para todo o HTML
    <html lang="pt-BR" className="h-full bg-slate-950 antialiased">
      <head />
      {/* Aplica a fonte Inter e estilos base no body */}
      <body className={`${inter.className} h-full`}>
        {/* Providers envolvem a aplicação com contextos necessários (auth, theme, etc) */}
        <Providers>{children}</Providers>
      </body>
    </html>
  )
} 
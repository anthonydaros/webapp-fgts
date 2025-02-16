'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  List,
  LogOut,
  Building2,
  PuzzleIcon,
} from 'lucide-react'
import { useEffect } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Corretores', href: '/brokers', icon: Users },
  { name: 'Propostas', href: '/proposals', icon: FileText },
  { name: 'Usuários', href: '/users', icon: Users },
  { name: 'Integrações', href: '/integrations', icon: PuzzleIcon },
  { name: 'Configurações', href: '/settings', icon: Settings },
  { name: 'Logs', href: '/logs', icon: List },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-800/50 backdrop-blur-sm border-r border-slate-700 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center gap-x-3">
            <div className="rounded-full bg-slate-800 p-2 ring-2 ring-slate-700">
              <Building2 className="h-5 w-5 text-slate-200" />
            </div>
            <h1 className="text-xl font-bold text-slate-200">WebApp FGTS</h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`
                            group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                            ${
                              isActive
                                ? 'bg-slate-700/50 text-slate-200'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
                            }
                          `}
                        >
                          <item.icon
                            className={`h-6 w-6 shrink-0 ${
                              isActive
                                ? 'text-slate-200'
                                : 'text-slate-400 group-hover:text-slate-200'
                            }`}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
              <li className="mt-auto">
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
                >
                  <LogOut
                    className="h-6 w-6 shrink-0 text-slate-400 group-hover:text-slate-200"
                    aria-hidden="true"
                  />
                  Sair
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <main className="lg:pl-72">
        <div className="px-4 sm:px-6 lg:px-8 py-6">{children}</div>
      </main>
    </div>
  )
} 
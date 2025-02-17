import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Users, FileText, Building2, Settings, ScrollText } from 'lucide-react'
import { Role } from '@/types'
import { LucideIcon } from 'lucide-react'

interface MenuItem {
  href: string
  label: string
  icon: LucideIcon
  allowedRoles: Role[]
}

const menuItems: MenuItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    allowedRoles: [Role.ADMIN, Role.SUPPORT],
  },
  {
    href: '/brokers',
    label: 'Corretores',
    icon: Building2,
    allowedRoles: [Role.ADMIN, Role.SUPPORT],
  },
  {
    href: '/proposals',
    label: 'Propostas',
    icon: FileText,
    allowedRoles: [Role.ADMIN, Role.SUPPORT, Role.BROKER],
  },
  {
    href: '/users',
    label: 'Usuários',
    icon: Users,
    allowedRoles: [Role.ADMIN, Role.SUPPORT],
  },
  {
    href: '/settings',
    label: 'Configurações',
    icon: Settings,
    allowedRoles: [Role.ADMIN],
  },
  {
    href: '/logs',
    label: 'Logs',
    icon: ScrollText,
    allowedRoles: [Role.ADMIN],
  },
]

export function NavigationMenu() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const userRole = session?.user?.role as Role | undefined
  const settings = session?.user?.settings

  // Filter menu items based on user role and broker access settings
  const filteredMenuItems = menuItems.filter((item) => {
    if (!userRole) return false
    if (userRole === Role.BROKER) {
      return item.allowedRoles.includes(Role.BROKER) && settings?.general?.brokerAdminAccess
    }
    return item.allowedRoles.includes(userRole)
  })

  return (
    <nav className="space-y-1">
      {filteredMenuItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-slate-100 transition-all hover:text-slate-100 hover:bg-slate-800/50',
              isActive && 'bg-slate-800/50 text-slate-100'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
} 
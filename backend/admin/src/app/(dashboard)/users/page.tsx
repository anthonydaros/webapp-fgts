'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowUpCircle, Edit2, Filter, Search, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Role } from '@prisma/client'
import { formatCPF } from '@/lib/utils'

type User = {
  id: string
  numId: number
  name: string
  email: string
  cpf: string
  phone?: string
  role: Role
  createdAt: Date
  referralUser?: {
    name: string
  }
}

type SortConfig = {
  key: keyof User
  direction: 'asc' | 'desc'
}

type RoleFilterType = 'all' | User['role']

const roleConfig: Record<Role, { label: string; color: string }> = {
  [Role.ADMIN]: { label: 'Admin', color: 'rose' },
  [Role.BROKER]: { label: 'Corretor', color: 'emerald' },
  [Role.SUPPORT]: { label: 'Suporte', color: 'amber' },
  [Role.USER]: { label: 'Usuário', color: 'primary' },
}

export default function UsersPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const userRole = session?.user?.role as Role | undefined

  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<RoleFilterType>('all')
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'id',
    direction: 'desc',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Iniciando busca de usuários...')
        console.log('Session:', session)
        
        const response = await fetch('/api/users', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
        
        console.log('Status da resposta:', response.status)
        const responseText = await response.text()
        console.log('Resposta bruta:', responseText)
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Não autorizado. Por favor, faça login novamente.')
          }
          throw new Error(`Erro ao buscar usuários: ${response.status} ${responseText}`)
        }
        
        const data = JSON.parse(responseText)
        console.log('Dados recebidos:', data)
        setUsers(data)
      } catch (error) {
        console.error('Erro detalhado ao buscar usuários:', error)
        setUsers([])
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user) {
      console.log('Sessão encontrada, iniciando busca...')
      fetchUsers()
    } else {
      console.log('Sem sessão, aguardando login...')
    }
  }, [session])

  const handleSort = (key: keyof User) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    }))
  }

  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    const direction = sortConfig.direction === 'asc' ? 1 : -1

    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return direction * aValue.localeCompare(bValue)
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return direction * (aValue.getTime() - bValue.getTime())
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction * (aValue - bValue)
    }

    return 0
  })

  const filteredUsers = sortedUsers.filter((user) => {
    // Support users can't see admin users
    if (userRole === Role.SUPPORT && user.role === Role.ADMIN) {
      return false
    }

    const matchesSearch = 
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.cpf && user.cpf.includes(searchQuery.replace(/\D/g, ''))) ||
      (user.phone && user.phone.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesRole = roleFilter === 'all' || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const handleFiltersChange = () => {
    setCurrentPage(1)
  }

  const handleRoleChange = (value: string) => {
    setRoleFilter(value as RoleFilterType)
    handleFiltersChange()
  }

  const handleUpgradeToBroker = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/upgrade-to-broker`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to upgrade user to broker')
      }

      // Refresh the users list
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, role: Role.BROKER } : user
      )
      setUsers(updatedUsers)
    } catch (error) {
      console.error('Error upgrading user to broker:', error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId))
      } else {
        const error = await response.text()
        alert(`Erro ao excluir usuário: ${error}`)
      }
    } catch (error) {
      console.error('Erro ao excluir usuário:', error)
      alert('Erro ao excluir usuário. Tente novamente.')
    }
  }

  if (!session?.user) {
    return (
      <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
        <p className="text-slate-400">Faça login para visualizar os usuários</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Usuários</h1>
          <p className="text-sm text-slate-400">
            Gerencie os usuários do sistema
          </p>
        </div>

        <Button
          onClick={() => router.push('/users/new')}
          className="bg-primary-500 text-white hover:bg-primary-600"
        >
          Novo Usuário
        </Button>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100">Filtros</CardTitle>
          <CardDescription className="text-slate-400">
            Filtre os usuários por nome, email ou função
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por nome, email, CPF ou telefone"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    handleFiltersChange()
                  }}
                  className="pl-8 bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus-visible:border-slate-500"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={roleFilter}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-slate-400" />
                      <span>
                        {roleFilter === 'all'
                          ? 'Todas as funções'
                          : roleConfig[roleFilter].label}
                      </span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as funções</SelectItem>
                  {Object.entries(roleConfig).map(([role, config]) => (
                    <SelectItem key={role} value={role}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-6">
          <div className="rounded-md border border-slate-700">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-transparent">
                  <TableHead
                    className="text-slate-400 cursor-pointer hover:text-slate-100 transition-colors"
                    onClick={() => handleSort('numId')}
                  >
                    <div className="flex items-center gap-2">
                      # {sortConfig.key === 'numId' && (
                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-slate-400 cursor-pointer hover:text-slate-100 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Nome {sortConfig.key === 'name' && (
                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-slate-400 cursor-pointer hover:text-slate-100 transition-colors"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center gap-2">
                      Email {sortConfig.key === 'email' && (
                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-slate-400 cursor-pointer hover:text-slate-100 transition-colors"
                    onClick={() => handleSort('cpf')}
                  >
                    <div className="flex items-center gap-2">
                      CPF {sortConfig.key === 'cpf' && (
                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-slate-400 cursor-pointer hover:text-slate-100 transition-colors"
                    onClick={() => handleSort('phone')}
                  >
                    <div className="flex items-center gap-2">
                      Telefone {sortConfig.key === 'phone' && (
                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-slate-400 cursor-pointer hover:text-slate-100 transition-colors"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center gap-2">
                      Função {sortConfig.key === 'role' && (
                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-slate-400">
                    <div className="flex items-center gap-2">
                      Indicador
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-slate-400 cursor-pointer hover:text-slate-100 transition-colors"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-2">
                      Data de Cadastro {sortConfig.key === 'createdAt' && (
                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-slate-400 text-right">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user, index) => (
                  <TableRow 
                    key={user.id}
                    className="border-b border-slate-700/50 hover:bg-slate-700/25 transition-colors animate-in slide-in-from-left duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="text-slate-100 font-medium">{user.numId}</TableCell>
                    <TableCell className="text-slate-100 font-medium">{user.name}</TableCell>
                    <TableCell className="text-slate-300">{user.email}</TableCell>
                    <TableCell className="text-slate-300 font-mono text-sm">{formatCPF(user.cpf)}</TableCell>
                    <TableCell className="text-slate-300">{user.phone}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`bg-${roleConfig[user.role].color}-500/15 text-${roleConfig[user.role].color}-500 hover:bg-${roleConfig[user.role].color}-500/25 border-${roleConfig[user.role].color}-500/50`}
                      >
                        {roleConfig[user.role].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {user.referralUser?.name || '-'}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => router.push(`/users/${user.id}/edit`)}
                          className="h-8 w-8 bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-slate-200"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        {user.role === Role.USER && (
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleUpgradeToBroker(user.id)}
                            className="h-8 w-8 bg-emerald-950/50 hover:bg-emerald-900 border-emerald-800 text-emerald-200"
                            title="Promover a Corretor"
                          >
                            <ArrowUpCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {user.role !== Role.ADMIN && (
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleDeleteUser(user.id)}
                            className="h-8 w-8 bg-rose-950/50 hover:bg-rose-900 border-rose-800 text-rose-200"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
            <div>
              Mostrando {startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, filteredUsers.length)} de{' '}
              {filteredUsers.length} usuários
            </div>
            {filteredUsers.length > 50 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-8 bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-slate-200"
                >
                  Anterior
                </Button>
                <span className="text-sm">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="h-8 bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-slate-200"
                >
                  Próxima
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
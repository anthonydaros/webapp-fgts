'use client'

import { useState } from 'react'
import { Title, Text } from '@tremor/react'
import { Edit2, Trash2, Plus, Users2, Search, RefreshCw, QrCode, FileSpreadsheet, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { Input } from '../../../components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select"

type Broker = {
  id: string
  userId: string
  name: string
  email: string
  cpf: string
  phone: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  createdAt: string
}

type SortConfig = {
  key: keyof Broker
  direction: 'asc' | 'desc'
}

type StatusFilterType = 'all' | Broker['status']

const mockBrokers: Broker[] = [
  {
    id: '1',
    userId: 'usr_123',
    name: 'João Silva',
    email: 'joao@example.com',
    cpf: '123.456.789-00',
    phone: '(11) 99999-9999',
    status: 'ACTIVE',
    createdAt: '2024-02-14',
  },
  {
    id: '2',
    userId: 'usr_456',
    name: 'Maria Santos',
    email: 'maria@example.com',
    cpf: '987.654.321-00',
    phone: '(11) 88888-8888',
    status: 'INACTIVE',
    createdAt: '2024-02-13',
  },
  {
    id: '3',
    userId: 'usr_789',
    name: 'Pedro Oliveira',
    email: 'pedro@example.com',
    cpf: '456.789.123-00',
    phone: '(11) 77777-7777',
    status: 'SUSPENDED',
    createdAt: '2024-02-12',
  },
]

const ITEMS_PER_PAGE = 50

export default function BrokersPage() {
  const router = useRouter()
  const [brokers, setBrokers] = useState<Broker[]>(mockBrokers)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)

  const statusConfig = {
    ACTIVE: {
      label: 'Ativo',
      className: 'bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25',
    },
    INACTIVE: {
      label: 'Inativo',
      className: 'bg-slate-500/15 text-slate-500 hover:bg-slate-500/25',
    },
    SUSPENDED: {
      label: 'Suspenso',
      className: 'bg-rose-500/15 text-rose-500 hover:bg-rose-500/25',
    },
  }

  const handleSort = (key: keyof Broker) => {
    setSortConfig((currentConfig) => ({
      key,
      direction:
        currentConfig.key === key && currentConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    }))
  }

  const handleExportXLS = () => {
    // Convert brokers data to CSV format
    const headers = ['Nome', 'Email', 'CPF', 'Telefone', 'Status', 'Data de Cadastro']
    const csvContent = [
      headers.join(','),
      ...filteredBrokers.map(broker => [
        broker.name,
        broker.email,
        broker.cpf,
        broker.phone,
        statusConfig[broker.status].label,
        new Date(broker.createdAt).toLocaleDateString('pt-BR')
      ].join(','))
    ].join('\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `corretores_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const sortedBrokers = [...brokers].sort((a, b) => {
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const filteredBrokers = sortedBrokers.filter((broker) => {
    const matchesSearch = 
      broker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      broker.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      broker.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      broker.cpf.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || broker.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredBrokers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedBrokers = filteredBrokers.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Reset to first page when filters change
  const handleFiltersChange = () => {
    setCurrentPage(1)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as StatusFilterType)
    handleFiltersChange()
  }

  return (
    <div className="space-y-6 p-1 sm:p-4 animate-in fade-in duration-500">
      <div className="grid gap-6">
        {/* Header Card */}
        <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/10 shadow-xl rounded-xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-700/50 rounded-lg">
                  <Users2 className="h-5 w-5 text-slate-100" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-100">Corretores</CardTitle>
                  <CardDescription className="text-slate-400">
                    Gerencie os corretores cadastrados no sistema
                  </CardDescription>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial min-w-[300px] sm:min-w-[400px]">
                  <Input
                    type="text"
                    placeholder="Buscar por nome, email, CPF ou telefone..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      handleFiltersChange()
                    }}
                    className="w-full pl-10 bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus-visible:border-slate-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-[200px] bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="ACTIVE">Ativo</SelectItem>
                    <SelectItem value="INACTIVE">Inativo</SelectItem>
                    <SelectItem value="SUSPENDED">Suspenso</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleExportXLS}
                  className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => router.push('/brokers/new')}
                  className="bg-primary-600 hover:bg-primary-700 text-white gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Novo Corretor
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table Card */}
        <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/10 shadow-xl rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-700 hover:bg-transparent">
                    <TableHead 
                      className="text-slate-300 cursor-pointer hover:text-slate-100"
                      onClick={() => handleSort('userId')}
                    >
                      ID {sortConfig.key === 'userId' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="text-slate-300 cursor-pointer hover:text-slate-100"
                      onClick={() => handleSort('name')}
                    >
                      Nome {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="text-slate-300 cursor-pointer hover:text-slate-100"
                      onClick={() => handleSort('email')}
                    >
                      Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="text-slate-300 cursor-pointer hover:text-slate-100"
                      onClick={() => handleSort('cpf')}
                    >
                      CPF {sortConfig.key === 'cpf' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="text-slate-300 cursor-pointer hover:text-slate-100"
                      onClick={() => handleSort('phone')}
                    >
                      Telefone {sortConfig.key === 'phone' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="text-slate-300 cursor-pointer hover:text-slate-100"
                      onClick={() => handleSort('status')}
                    >
                      Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="text-slate-300 cursor-pointer hover:text-slate-100"
                      onClick={() => handleSort('createdAt')}
                    >
                      Data de Cadastro {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="text-slate-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBrokers.map((broker, index) => (
                    <TableRow 
                      key={broker.id}
                      className="border-b border-slate-700/50 hover:bg-slate-700/25 transition-colors animate-in slide-in-from-left duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="text-slate-100 font-medium">#{broker.userId}</TableCell>
                      <TableCell className="text-slate-100 font-medium">{broker.name}</TableCell>
                      <TableCell className="text-slate-300">{broker.email}</TableCell>
                      <TableCell className="text-slate-300">{broker.cpf}</TableCell>
                      <TableCell className="text-slate-300">{broker.phone}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusConfig[broker.status].className}
                        >
                          {statusConfig[broker.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {new Date(broker.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/brokers/${broker.id}/edit`)}
                            className="h-8 bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-slate-200 gap-2"
                          >
                            <Edit2 className="h-4 w-4" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // Implement QR Code generation
                              alert(`Gerando QR Code para o corretor ${broker.name}`)
                            }}
                            className="h-8 bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-slate-200 gap-2"
                          >
                            <QrCode className="h-4 w-4" />
                            QR Code
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (confirm('Tem certeza que deseja excluir este corretor?')) {
                                // Delete broker
                              }
                            }}
                            className="h-8 bg-rose-950/50 hover:bg-rose-900 border-rose-800 text-rose-200 gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Excluir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between p-4 border-t border-slate-700">
            <div className="text-sm text-slate-400">
              Mostrando {startIndex + 1} até {Math.min(startIndex + ITEMS_PER_PAGE, filteredBrokers.length)} de {filteredBrokers.length} registros
            </div>
            {filteredBrokers.length > 50 && (
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-8 bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-slate-200 gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <div className="text-sm text-slate-400 min-w-[100px] text-center">
                  Página {currentPage} de {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-slate-200 gap-2"
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 
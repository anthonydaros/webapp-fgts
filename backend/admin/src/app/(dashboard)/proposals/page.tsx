'use client'

import { useState } from 'react'
import { FileSpreadsheet, FileText, Search, ChevronLeft, ChevronRight, Eye, Filter } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardTitle, CardDescription, CardFooter } from '../../../components/ui/card'
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
import { DateRangeFilter } from '@/components/ui/date-range-filter'
import { DateRange } from 'react-day-picker'
import { PriceRangeSlider } from '@/components/ui/price-range-slider'

type Proposal = {
  id: string
  userId: string
  userName: string
  userCpf: string
  userPhone: string
  brokerId: string | null
  brokerName: string | null
  amount: number
  status: 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  bankStatus: 'AVERBADA' | 'CANCELADA' | 'EM_FORMALIZACAO'
  createdAt: string
}

type SortConfig = {
  key: keyof Proposal
  direction: 'asc' | 'desc'
}

type StatusFilterType = 'all' | Proposal['status']
type BankStatusFilterType = 'all' | Proposal['bankStatus']

const mockProposals: Proposal[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Maria Santos',
    userCpf: '123.456.789-00',
    userPhone: '(11) 99999-9999',
    brokerId: '1',
    brokerName: 'João Silva',
    amount: 50000,
    status: 'PENDING',
    bankStatus: 'EM_FORMALIZACAO',
    createdAt: '2024-02-14',
  },
  {
    id: '2',
    userId: '2',
    userName: 'Pedro Oliveira',
    userCpf: '987.654.321-00',
    userPhone: '(11) 98888-8888',
    brokerId: '2',
    brokerName: 'Maria Santos',
    amount: 75000,
    status: 'APPROVED',
    bankStatus: 'AVERBADA',
    createdAt: '2024-02-13',
  },
  {
    id: '3',
    userId: '3',
    userName: 'Ana Costa',
    userCpf: '456.789.123-00',
    userPhone: '(11) 97777-7777',
    brokerId: null,
    brokerName: null,
    amount: 30000,
    status: 'REJECTED',
    bankStatus: 'CANCELADA',
    createdAt: '2024-02-12',
  },
]

const ITEMS_PER_PAGE = 50

export default function ProposalsPage() {
  const router = useRouter()
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all')
  const [bankStatusFilter, setBankStatusFilter] = useState<BankStatusFilterType>('all')
  const [brokerFilter, setBrokerFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdAt', direction: 'desc' })
  const [currentPage, setCurrentPage] = useState(1)

  const statusConfig = {
    PENDING: {
      label: 'Pendente',
      className: 'bg-amber-500/15 text-amber-500 hover:bg-amber-500/25',
    },
    PROCESSING: {
      label: 'Em Análise',
      className: 'bg-blue-500/15 text-blue-500 hover:bg-blue-500/25',
    },
    APPROVED: {
      label: 'Aprovada',
      className: 'bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25',
    },
    REJECTED: {
      label: 'Rejeitada',
      className: 'bg-rose-500/15 text-rose-500 hover:bg-rose-500/25',
    },
    CANCELLED: {
      label: 'Cancelada',
      className: 'bg-slate-500/15 text-slate-500 hover:bg-slate-500/25',
    },
  }

  const bankStatusConfig = {
    AVERBADA: {
      label: 'Averbada',
      className: 'bg-blue-500/15 text-blue-500 hover:bg-blue-500/25',
    },
    CANCELADA: {
      label: 'Cancelada',
      className: 'bg-rose-500/15 text-rose-500 hover:bg-rose-500/25',
    },
    EM_FORMALIZACAO: {
      label: 'Em Formalização',
      className: 'bg-amber-500/15 text-amber-500 hover:bg-amber-500/25',
    },
  }

  const handleSort = (key: keyof Proposal) => {
    setSortConfig((currentConfig) => ({
      key,
      direction:
        currentConfig.key === key && currentConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    }))
  }

  const handleExportXLS = () => {
    // Convert proposals data to CSV format
    const headers = ['ID', 'Cliente', 'CPF', 'Telefone', 'Corretor', 'Valor', 'Status', 'Data']
    const csvContent = [
      headers.join(','),
      ...filteredProposals.map(proposal => [
        proposal.id,
        proposal.userName,
        proposal.userCpf,
        proposal.userPhone,
        proposal.brokerName || '-',
        proposal.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        statusConfig[proposal.status].label,
        new Date(proposal.createdAt).toLocaleDateString('pt-BR')
      ].join(','))
    ].join('\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `propostas_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const sortedProposals = [...proposals].sort((a, b) => {
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    // Handle null values in sorting
    if (aValue === null && bValue === null) return 0
    if (aValue === null) return sortConfig.direction === 'asc' ? -1 : 1
    if (bValue === null) return sortConfig.direction === 'asc' ? 1 : -1

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const filteredProposals = sortedProposals.filter((proposal) => {
    const matchesSearch = 
      proposal.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.userCpf.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.userPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (proposal.brokerName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      proposal.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter
    const matchesBankStatus = bankStatusFilter === 'all' || proposal.bankStatus === bankStatusFilter
    const matchesBroker = brokerFilter === 'all' || proposal.brokerId === brokerFilter
    const matchesPrice = proposal.amount >= priceRange[0] && proposal.amount <= priceRange[1]

    const matchesDateRange = !dateRange?.from || !dateRange?.to || (
      new Date(proposal.createdAt) >= dateRange.from &&
      new Date(proposal.createdAt) <= dateRange.to
    )

    return matchesSearch && matchesStatus && matchesBankStatus && matchesBroker && matchesDateRange && matchesPrice
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredProposals.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedProposals = filteredProposals.slice(startIndex, startIndex + ITEMS_PER_PAGE)

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
                  <FileText className="h-5 w-5 text-slate-100" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-100">Propostas</CardTitle>
                  <CardDescription className="text-slate-400">
                    Gerencie as propostas de empréstimo
                  </CardDescription>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial min-w-[300px] sm:min-w-[400px]">
                  <Input
                    type="text"
                    placeholder="Buscar por cliente, corretor ou ID..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      handleFiltersChange()
                    }}
                    className="w-full pl-10 bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus-visible:border-slate-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
                  className="bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-slate-200 gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filtros avançados
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleExportXLS}
                  className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {isAdvancedFilterOpen && (
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-700">
                <Select
                  value={statusFilter}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-[200px] bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500">
                    <SelectValue placeholder="Status da Proposta" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="PENDING">Pendente</SelectItem>
                    <SelectItem value="PROCESSING">Em Análise</SelectItem>
                    <SelectItem value="APPROVED">Aprovada</SelectItem>
                    <SelectItem value="REJECTED">Rejeitada</SelectItem>
                    <SelectItem value="CANCELLED">Cancelada</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={bankStatusFilter}
                  onValueChange={(value) => {
                    setBankStatusFilter(value as BankStatusFilterType)
                    handleFiltersChange()
                  }}
                >
                  <SelectTrigger className="w-[200px] bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500">
                    <SelectValue placeholder="Status no Banco" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="AVERBADA">Averbada</SelectItem>
                    <SelectItem value="CANCELADA">Cancelada</SelectItem>
                    <SelectItem value="EM_FORMALIZACAO">Em Formalização</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={brokerFilter}
                  onValueChange={(value) => {
                    setBrokerFilter(value)
                    handleFiltersChange()
                  }}
                >
                  <SelectTrigger className="w-[200px] bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500">
                    <SelectValue placeholder="Corretor" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                    <SelectItem value="all">Todos os Corretores</SelectItem>
                    {Array.from(new Set(proposals.map(p => p.brokerId))).filter(Boolean).map((brokerId) => {
                      const broker = proposals.find(p => p.brokerId === brokerId)
                      return (
                        <SelectItem key={brokerId} value={brokerId!}>
                          {broker?.brokerName || 'Sem nome'}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>

                <DateRangeFilter
                  dateRange={dateRange}
                  onDateRangeChange={(range) => {
                    setDateRange(range)
                    handleFiltersChange()
                  }}
                />

                <div className="w-full mt-4">
                  <h4 className="text-sm font-medium text-slate-100 mb-2">Valor do Empréstimo</h4>
                  <PriceRangeSlider
                    min={0}
                    max={100000}
                    step={1000}
                    value={priceRange}
                    onValueChange={(value) => {
                      setPriceRange(value)
                      handleFiltersChange()
                    }}
                  />
                </div>
              </div>
            )}
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
                      onClick={() => handleSort('id')}
                    >
                      ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="text-slate-300 cursor-pointer hover:text-slate-100"
                      onClick={() => handleSort('userName')}
                    >
                      Cliente {sortConfig.key === 'userName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="text-slate-300 cursor-pointer hover:text-slate-100"
                      onClick={() => handleSort('userCpf')}
                    >
                      CPF {sortConfig.key === 'userCpf' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="text-slate-300 cursor-pointer hover:text-slate-100"
                      onClick={() => handleSort('userPhone')}
                    >
                      Telefone {sortConfig.key === 'userPhone' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="text-slate-300 cursor-pointer hover:text-slate-100"
                      onClick={() => handleSort('brokerName')}
                    >
                      Corretor {sortConfig.key === 'brokerName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="text-slate-300 cursor-pointer hover:text-slate-100"
                      onClick={() => handleSort('amount')}
                    >
                      Valor {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="text-slate-300 cursor-pointer hover:text-slate-100"
                      onClick={() => handleSort('status')}
                    >
                      Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="text-slate-300 cursor-pointer hover:text-slate-100"
                      onClick={() => handleSort('bankStatus')}
                    >
                      Status Banco {sortConfig.key === 'bankStatus' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="text-slate-300 cursor-pointer hover:text-slate-100"
                      onClick={() => handleSort('createdAt')}
                    >
                      Data {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="text-slate-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProposals.map((proposal, index) => (
                    <TableRow 
                      key={proposal.id}
                      className="border-b border-slate-700/50 hover:bg-slate-700/25 transition-colors animate-in slide-in-from-left duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="text-slate-100 font-medium">#{proposal.id}</TableCell>
                      <TableCell className="text-slate-300">{proposal.userName}</TableCell>
                      <TableCell className="text-slate-300">{proposal.userCpf}</TableCell>
                      <TableCell className="text-slate-300">{proposal.userPhone}</TableCell>
                      <TableCell className="text-slate-300">{proposal.brokerName || '-'}</TableCell>
                      <TableCell className="text-slate-300">
                        {proposal.amount.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusConfig[proposal.status].className}
                        >
                          {statusConfig[proposal.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={bankStatusConfig[proposal.bankStatus].className}
                        >
                          {bankStatusConfig[proposal.bankStatus].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/proposals/${proposal.id}`)}
                            className="h-8 bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-slate-200 gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            Ver Proposta
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // Implement formalization link functionality
                              window.open(`/proposals/${proposal.id}/formalization`, '_blank')
                            }}
                            className="h-8 bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-slate-200 gap-2"
                          >
                            <FileText className="h-4 w-4" />
                            Formalização
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
              Mostrando {startIndex + 1} até {Math.min(startIndex + ITEMS_PER_PAGE, filteredProposals.length)} de {filteredProposals.length} registros
            </div>
            {filteredProposals.length > 50 && (
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
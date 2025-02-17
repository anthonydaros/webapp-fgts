'use client'

import { Text, Metric } from '@tremor/react'
import { Activity, Users, FileText, CheckCircle, XCircle, TrendingUp, PieChart, CalendarRange } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '../../../components/ui/chart'
import { Button } from '../../../components/ui/button'
import { Calendar } from '../../../components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { DateRange } from "react-day-picker"
import { DateRangeFilter } from '@/components/ui/date-range-filter'

// Dados estáticos para as métricas principais
const stats = [
  {
    name: 'Total de Propostas',
    value: '156',
    icon: FileText,
    change: '+12%',
    changeType: 'positive',
  },
  {
    name: 'Propostas Aprovadas',
    value: '89',
    icon: CheckCircle,
    change: '+18%',
    changeType: 'positive',
  },
  {
    name: 'Propostas Rejeitadas',
    value: '67',
    icon: XCircle,
    change: '-5%',
    changeType: 'negative',
  },
  {
    name: 'Corretores Ativos',
    value: '12',
    icon: Users,
    change: '+2',
    changeType: 'positive',
  },
]

// Dados do gráfico de simulações e propostas
const chartdata = [
  {
    month: 'Jan',
    simulacoes: 120,
    propostas: 45,
  },
  {
    month: 'Fev',
    simulacoes: 145,
    propostas: 52,
  },
  {
    month: 'Mar',
    simulacoes: 135,
    propostas: 48,
  },
  {
    month: 'Abr',
    simulacoes: 170,
    propostas: 61,
  },
  {
    month: 'Mai',
    simulacoes: 150,
    propostas: 55,
  },
]

// Configuração das cores e labels dos gráficos
const chartConfig = {
  simulacoes: {
    label: 'Simulações',
    color: 'hsl(var(--chart-1))',
  },
  propostas: {
    label: 'Propostas Enviadas',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

// Dados do gráfico de status das propostas
const statusData = [
  {
    name: 'Aprovadas',
    value: 89,
    color: 'hsl(var(--emerald-500))',
  },
  {
    name: 'Rejeitadas',
    value: 67,
    color: 'hsl(var(--rose-500))',
  },
  {
    name: 'Em Análise',
    value: 45,
    color: 'hsl(var(--amber-500))',
  },
]

// Página principal do dashboard
export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })

  // Redireciona para login se não estiver autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Exibe loading enquanto verifica a autenticação
  if (status === 'loading') {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )
  }

  // Não renderiza nada se não estiver autenticado
  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="space-y-6 p-1 sm:p-4 animate-in fade-in duration-500">
      {/* Filtro de data */}
      <div className="flex justify-end mb-4">
        <DateRangeFilter
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>

      {/* Cards de métricas principais */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card 
            key={stat.name} 
            className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/10 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <stat.icon className="h-6 w-6 text-slate-100" />
                <Text className="text-slate-100 font-medium">{stat.name}</Text>
              </div>
              <div className="space-y-1 mt-2">
                <Metric className="text-slate-50 font-bold">{stat.value}</Metric>
                <Text
                  className={
                    stat.changeType === 'positive'
                      ? 'text-emerald-400 font-medium'
                      : 'text-rose-400 font-medium'
                  }
                >
                  {stat.change}
                </Text>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos de análise */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Gráfico de área - Simulações vs Propostas */}
        <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/10 shadow-xl transition-all duration-300 hover:shadow-2xl animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-100">Propostas por Mês</CardTitle>
                <CardDescription className="text-slate-300">
                  Comparativo entre simulações e propostas enviadas
                </CardDescription>
              </div>
              <div className="p-2 bg-slate-700/50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-slate-100" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                  data={chartdata}
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--slate-700))" />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--slate-500))"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis
                    stroke="hsl(var(--slate-500))"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip content={<ChartTooltipContent config={chartConfig} />} cursor={false} />
                  <Area
                    type="monotone"
                    dataKey="simulacoes"
                    stackId="1"
                    stroke="var(--color-simulacoes)"
                    fill="var(--color-simulacoes)"
                    fillOpacity={0.2}
                  />
                  <Area
                    type="monotone"
                    dataKey="propostas"
                    stackId="1"
                    stroke="var(--color-propostas)"
                    fill="var(--color-propostas)"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none text-slate-100">
                  Crescimento de 5.2% este mês <TrendingUp className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 leading-none text-slate-400">
                  Janeiro - Maio 2024
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Gráfico de barras - Status das Propostas */}
        <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/10 shadow-xl transition-all duration-300 hover:shadow-2xl animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '500ms' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-100">Status das Propostas</CardTitle>
                <CardDescription className="text-slate-300">
                  Distribuição por status atual
                </CardDescription>
              </div>
              <div className="p-2 bg-slate-700/50 rounded-lg">
                <PieChart className="h-5 w-5 text-slate-100" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={statusData}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
                barSize={40}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--slate-700))" />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--slate-500))"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  stroke="hsl(var(--slate-500))"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                  fill="currentColor"
                  stroke="none"
                  className="fill-current text-primary-500"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Lista de atividades recentes */}
      <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/10 shadow-xl transition-all duration-300 hover:shadow-2xl animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '600ms' }}>
        <CardHeader>
          <CardTitle className="text-slate-100">Últimas Atividades</CardTitle>
          <CardDescription className="text-slate-300">
            Atividades mais recentes no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-700/30 transition-colors">
                <Activity className="h-5 w-5 text-slate-300" />
                <div>
                  <Text className="text-slate-100">Proposta #123{i} foi aprovada</Text>
                  <Text className="text-slate-300">Há 2 horas</Text>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
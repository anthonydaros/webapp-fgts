'use client'

import { useState } from 'react'
import { PuzzleIcon, Search, Settings as SettingsIcon } from 'lucide-react'
import { Card, CardContent, CardTitle, CardDescription, CardFooter } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Switch } from '../../../components/ui/switch'

type Integration = {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive'
  icon: string
  configurable: boolean
}

const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Banco do Brasil',
    description: 'Integração para consulta de margem e formalização de contratos',
    status: 'active',
    icon: '🏦',
    configurable: true,
  },
  {
    id: '2',
    name: 'Caixa Econômica',
    description: 'Integração para consulta de FGTS e simulação de empréstimo',
    status: 'inactive',
    icon: '🏦',
    configurable: true,
  },
  {
    id: '3',
    name: 'WhatsApp Business',
    description: 'Envio automático de mensagens e notificações',
    status: 'active',
    icon: '💬',
    configurable: true,
  },
  {
    id: '4',
    name: 'SMS Twilio',
    description: 'Envio de SMS para confirmação e notificações',
    status: 'inactive',
    icon: '📱',
    configurable: true,
  },
  {
    id: '5',
    name: 'Salesforce',
    description: 'CRM para gestão de leads e oportunidades',
    status: 'inactive',
    icon: '📊',
    configurable: true,
  },
  {
    id: '6',
    name: 'PagSeguro',
    description: 'Gateway de pagamento para comissões',
    status: 'active',
    icon: '💳',
    configurable: true,
  },
]

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredIntegrations = integrations.filter((integration) =>
    integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    integration.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleToggleStatus = (integrationId: string) => {
    setIntegrations(currentIntegrations =>
      currentIntegrations.map(integration =>
        integration.id === integrationId
          ? {
              ...integration,
              status: integration.status === 'active' ? 'inactive' : 'active'
            }
          : integration
      )
    )
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
                  <PuzzleIcon className="h-5 w-5 text-slate-100" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-100">Integrações</CardTitle>
                  <CardDescription className="text-slate-400">
                    Gerencie as integrações disponíveis no sistema
                  </CardDescription>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial min-w-[300px] sm:min-w-[400px]">
                  <Input
                    type="text"
                    placeholder="Buscar integrações..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-400 focus-visible:ring-primary-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIntegrations.map((integration) => (
            <Card
              key={integration.id}
              className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/10 shadow-xl rounded-xl hover:shadow-2xl transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{integration.icon}</div>
                    <div>
                      <CardTitle className="text-lg text-slate-100">{integration.name}</CardTitle>
                    </div>
                  </div>
                  <Switch
                    checked={integration.status === 'active'}
                    onCheckedChange={() => handleToggleStatus(integration.id)}
                  />
                </div>
                <p className="mt-4 text-sm text-slate-400">
                  {integration.description}
                </p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-slate-200 gap-2"
                  onClick={() => {
                    // Implement configuration modal/page
                    alert(`Configurar ${integration.name}`)
                  }}
                  disabled={!integration.configurable || integration.status === 'inactive'}
                >
                  <SettingsIcon className="h-4 w-4" />
                  Configurar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 
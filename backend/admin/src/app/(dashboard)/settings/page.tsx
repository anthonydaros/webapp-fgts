'use client'

import { useState } from 'react'
import { Settings, Image as ImageIcon, HelpCircle, Calculator, Building2, Upload, Plus, Trash2, Phone, Mail, MessageSquare, Cog, BarChart3, ListChecks } from 'lucide-react'
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Switch } from '../../../components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { IconPicker } from '../../../components/ui/icon-picker'

type CarouselItem = {
  id: string
  icon: string
  description: string
}

type SurveyOption = {
  id: string
  name: string
  slug: string
}

type Survey = {
  title: string
  options: SurveyOption[]
}

type HelpStep = {
  id: string
  image: string
  description: string
}

type FAQ = {
  id: string
  question: string
  answer: string
}

type ContactInfo = {
  whatsapp: { value: string; enabled: boolean }
  email: { value: string; enabled: boolean }
  phone: { value: string; enabled: boolean }
}

type Settings = {
  general: {
    mode: 'production' | 'sandbox'
    skipHomeScreen: boolean
    enableSurvey: boolean
    validatePhoneWithCpf: boolean
    useWhatsappToken: boolean
    showInstallments: boolean
    showGrossValue: boolean
    minSimulationValue?: number
    maxSimulationValue?: number
    brokerAdminAccess: boolean
  }
  survey: Survey
  visual: {
    logo: string
    banner: string
    colors: string[]
    carouselItems: CarouselItem[]
    font: string
    appName: string
    texts: {
      releasedValueTitle: string
      initialPhrase: string
      preRegistrationText: string
      acceptanceText: string
      homeTopText: string
      formalizationText: string
      netValueText: string
    }
  }
  help: {
    contactInfo: ContactInfo
    faq: FAQ[]
  }
  steps: {
    items: HelpStep[]
  }
  company: {
    name: string
    address: string
    cnpj: string
    phone: string
    email: string
    mailServer: string
  }
}

const mockSettings: Settings = {
  general: {
    mode: 'sandbox',
    skipHomeScreen: false,
    enableSurvey: false,
    validatePhoneWithCpf: false,
    useWhatsappToken: false,
    showInstallments: true,
    showGrossValue: true,
    minSimulationValue: undefined,
    maxSimulationValue: undefined,
    brokerAdminAccess: false
  },
  survey: {
    title: '',
    options: []
  },
  visual: {
    logo: '',
    banner: '',
    colors: Array(12).fill('#000000'),
    carouselItems: [],
    font: 'Inter',
    appName: '',
    texts: {
      releasedValueTitle: '',
      initialPhrase: '',
      preRegistrationText: '',
      acceptanceText: '',
      homeTopText: '',
      formalizationText: '',
      netValueText: '',
    }
  },
  help: {
    contactInfo: {
      whatsapp: { value: '', enabled: false },
      email: { value: '', enabled: false },
      phone: { value: '', enabled: false },
    },
    faq: [],
  },
  steps: {
    items: [],
  },
  company: {
    name: '',
    address: '',
    cnpj: '',
    phone: '',
    email: '',
    mailServer: '',
  },
}

const googleFonts = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Raleway',
  'Ubuntu',
  'Playfair Display',
  'Source Sans Pro'
]

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(mockSettings)

  const handleAddCarouselItem = () => {
    setSettings(prev => ({
      ...prev,
      visual: {
        ...prev.visual,
        carouselItems: [
          ...prev.visual.carouselItems,
          { id: crypto.randomUUID(), icon: '', description: '' }
        ]
      }
    }))
  }

  const handleAddStep = () => {
    setSettings(prev => ({
      ...prev,
      steps: {
        items: [
          ...prev.steps.items,
          {
            id: crypto.randomUUID(),
            image: '',
            description: '',
          },
        ],
      },
    }))
  }

  const handleAddFAQ = () => {
    setSettings(prev => ({
      ...prev,
      help: {
        ...prev.help,
        faq: [
          ...prev.help.faq,
          { id: crypto.randomUUID(), question: '', answer: '' }
        ]
      }
    }))
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newColors = [...settings.visual.colors]
    newColors[index] = e.target.value
    setSettings(prev => ({
      ...prev,
      visual: { ...prev.visual, colors: newColors }
    }))
  }

  const handleCarouselIconChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newItems = [...settings.visual.carouselItems]
    newItems[index].icon = e.target.value
    setSettings(prev => ({
      ...prev,
      visual: { ...prev.visual, carouselItems: newItems }
    }))
  }

  const handleCarouselDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newItems = [...settings.visual.carouselItems]
    newItems[index].description = e.target.value
    setSettings(prev => ({
      ...prev,
      visual: { ...prev.visual, carouselItems: newItems }
    }))
  }

  const handleStepDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newSteps = [...settings.steps.items]
    newSteps[index] = { ...newSteps[index], description: e.target.value }
    setSettings(prev => ({
      ...prev,
      steps: { items: newSteps },
    }))
  }

  const handleAddSurveyOption = () => {
    if (settings.survey.options.length >= 5) return

    setSettings(prev => ({
      ...prev,
      survey: {
        ...prev.survey,
        options: [
          ...prev.survey.options,
          { id: crypto.randomUUID(), name: '', slug: '' }
        ]
      }
    }))
  }

  const handleSurveyOptionChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newOptions = [...settings.survey.options]
    const name = e.target.value
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    newOptions[index] = { ...newOptions[index], name, slug }
    setSettings(prev => ({
      ...prev,
      survey: { ...prev.survey, options: newOptions }
    }))
  }

  return (
    <div className="space-y-6 p-1 sm:p-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-700/50 rounded-lg">
          <Settings className="h-5 w-5 text-slate-100" />
        </div>
        <div>
          <CardTitle className="text-xl text-slate-100">Configurações</CardTitle>
          <CardDescription className="text-slate-400">
            Gerencie as configurações do sistema
          </CardDescription>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="w-full justify-start space-x-2">
          <TabsTrigger value="general" className="text-slate-100">
            <Cog className="h-4 w-4 mr-2" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="visual" className="text-slate-100">
            <ImageIcon className="h-4 w-4 mr-2" />
            Visual
          </TabsTrigger>
          <TabsTrigger value="survey" className="text-slate-100">
            <BarChart3 className="h-4 w-4 mr-2" />
            Enquete
          </TabsTrigger>
          <TabsTrigger value="steps" className="text-slate-100">
            <ListChecks className="h-4 w-4 mr-2" />
            Passo a Passo
          </TabsTrigger>
          <TabsTrigger value="help" className="text-slate-100">
            <HelpCircle className="h-4 w-4 mr-2" />
            Ajuda
          </TabsTrigger>
          <TabsTrigger value="company" className="text-slate-100">
            <Building2 className="h-4 w-4 mr-2" />
            Dados da Empresa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-slate-100">Configurações Gerais</CardTitle>
              <CardDescription className="text-slate-400">
                Configure as opções gerais do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mode Selection */}
              <div className="space-y-2">
                <Label className="text-slate-100">Modo</Label>
                <Select
                  value={settings.general.mode}
                  onValueChange={(value: 'production' | 'sandbox') => {
                    setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, mode: value }
                    }))
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o modo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="production">Produção</SelectItem>
                    <SelectItem value="sandbox">Sandbox</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Skip Home Screen */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-100">Tela Inicial Home</Label>
                  <p className="text-sm text-slate-400">Se desativado, vai direto para tela de CPF</p>
                </div>
                <Switch
                  checked={!settings.general.skipHomeScreen}
                  onCheckedChange={(checked) => {
                    setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, skipHomeScreen: !checked }
                    }))
                  }}
                />
              </div>

              {/* Enable Survey */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-100">Ativar Enquete</Label>
                  <p className="text-sm text-slate-400">Habilita o sistema de enquetes no app</p>
                </div>
                <Switch
                  checked={settings.general.enableSurvey}
                  onCheckedChange={(checked) => {
                    setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, enableSurvey: checked }
                    }))
                  }}
                />
              </div>

              {/* Validate Phone with CPF */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-100">Ativar Validação de Telefone com CPF</Label>
                  <p className="text-sm text-slate-400">Valida se o telefone está vinculado ao CPF</p>
                </div>
                <Switch
                  checked={settings.general.validatePhoneWithCpf}
                  onCheckedChange={(checked) => {
                    setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, validatePhoneWithCpf: checked }
                    }))
                  }}
                />
              </div>

              {/* Use Whatsapp Token */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-100">Usar Token WhatsApp</Label>
                  <p className="text-sm text-slate-400">Usa API do WhatsApp para validar telefone</p>
                </div>
                <Switch
                  checked={settings.general.useWhatsappToken}
                  onCheckedChange={(checked) => {
                    setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, useWhatsappToken: checked }
                    }))
                  }}
                />
              </div>

              {/* Show Installments */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-100">Mostrar Parcelas na Simulação</Label>
                  <p className="text-sm text-slate-400">Exibe a listagem de parcelas na simulação</p>
                </div>
                <Switch
                  checked={settings.general.showInstallments}
                  onCheckedChange={(checked) => {
                    setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, showInstallments: checked }
                    }))
                  }}
                />
              </div>

              {/* Show Gross Value */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-100">Mostrar Valor Bruto na Simulação</Label>
                  <p className="text-sm text-slate-400">Exibe o valor bruto na simulação</p>
                </div>
                <Switch
                  checked={settings.general.showGrossValue}
                  onCheckedChange={(checked) => {
                    setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, showGrossValue: checked }
                    }))
                  }}
                />
              </div>

              {/* Min Simulation Value */}
              <div className="space-y-2">
                <Label className="text-slate-100">Valor Mínimo na Simulação</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Usar valor da API"
                    value={settings.general.minSimulationValue ?? ''}
                    onChange={(e) => {
                      const value = e.target.value ? Number(e.target.value) : undefined
                      setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, minSimulationValue: value }
                      }))
                    }}
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                  />
                </div>
                <p className="text-sm text-slate-400">Deixe em branco para usar o valor definido via API</p>
              </div>

              {/* Max Simulation Value */}
              <div className="space-y-2">
                <Label className="text-slate-100">Valor Máximo na Simulação</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Usar valor da API"
                    value={settings.general.maxSimulationValue ?? ''}
                    onChange={(e) => {
                      const value = e.target.value ? Number(e.target.value) : undefined
                      setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, maxSimulationValue: value }
                      }))
                    }}
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                  />
                </div>
                <p className="text-sm text-slate-400">Deixe em branco para usar o valor definido via API</p>
              </div>

              {/* Broker Admin Access */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-100">Acesso ao Painel de Administração (Corretor)</Label>
                  <p className="text-sm text-slate-400">Somente para perfil corretor</p>
                </div>
                <Switch
                  checked={settings.general.brokerAdminAccess}
                  onCheckedChange={(checked) => {
                    setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, brokerAdminAccess: checked }
                    }))
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visual">
          <div className="space-y-4">
            {/* Basic Settings Card */}
            <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/10 shadow-xl">
              <CardContent className="p-6 space-y-6">
                {/* App Name */}
                <div className="space-y-2">
                  <Label className="text-slate-100">Nome do App</Label>
                  <Input
                    placeholder="Digite o nome do app..."
                    value={settings.visual.appName}
                    onChange={(e) => {
                      setSettings(prev => ({
                        ...prev,
                        visual: { ...prev.visual, appName: e.target.value }
                      }))
                    }}
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                  />
                </div>

                {/* Font Selection */}
                <div className="space-y-2">
                  <Label className="text-slate-100">Fonte do App</Label>
                  <Select
                    value={settings.visual.font}
                    onValueChange={(value) => {
                      setSettings(prev => ({
                        ...prev,
                        visual: { ...prev.visual, font: value }
                      }))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma fonte" />
                    </SelectTrigger>
                    <SelectContent>
                      {googleFonts.map(font => (
                        <SelectItem key={font} value={font}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Logo and Banner Uploads */}
                <div className="flex gap-6">
                  {/* Logo Upload */}
                  <div className="space-y-2 w-[30%]">
                    <Label className="text-slate-100">Logo</Label>
                    <div className="border-2 border-dashed border-slate-700 rounded-lg p-4 h-[120px] flex flex-col items-center justify-center text-center hover:border-primary-500 transition-colors cursor-pointer">
                      <input type="file" className="hidden" accept="image/*" />
                      <Upload className="h-8 w-8 mx-auto text-slate-400" />
                      <p className="mt-2 text-sm text-slate-400">Arraste ou clique para upload</p>
                    </div>
                  </div>

                  {/* Banner Upload */}
                  <div className="space-y-2 w-[70%]">
                    <Label className="text-slate-100">Banner</Label>
                    <div className="border-2 border-dashed border-slate-700 rounded-lg p-4 h-[120px] flex flex-col items-center justify-center text-center hover:border-primary-500 transition-colors cursor-pointer">
                      <input type="file" className="hidden" accept="image/*" />
                      <Upload className="h-8 w-8 mx-auto text-slate-400" />
                      <p className="mt-2 text-sm text-slate-400">Arraste ou clique para upload</p>
                    </div>
                  </div>
                </div>

                {/* Color Pickers */}
                <div className="space-y-2">
                  <Label className="text-slate-100">Cores do App</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {settings.visual.colors.map((color, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="relative">
                          <Input
                            type="color"
                            value={color}
                            onChange={(e) => handleColorChange(e, index)}
                            className="h-10 w-10 p-1 bg-slate-800/50 border-slate-700 cursor-pointer rounded-full overflow-hidden"
                            style={{ padding: '2px' }}
                          />
                        </div>
                        <Input
                          type="text"
                          value={color.toUpperCase()}
                          onChange={(e) => {
                            const newValue = e.target.value
                            if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newValue)) {
                              const newColors = [...settings.visual.colors]
                              newColors[index] = newValue
                              setSettings(prev => ({
                                ...prev,
                                visual: { ...prev.visual, colors: newColors }
                              }))
                            }
                          }}
                          className="flex-1 h-10 bg-slate-800/50 border-slate-700 text-slate-100 text-center font-mono text-sm"
                          placeholder="#000000"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Carousel Items Card */}
            <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/10 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-slate-100">Itens do Carrossel</CardTitle>
                <CardDescription className="text-slate-400">
                  Configure os itens que serão exibidos no carrossel do app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-end">
                  <Button
                    onClick={handleAddCarouselItem}
                    variant="outline"
                    size="sm"
                    className="bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-slate-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Item
                  </Button>
                </div>
                <div className="space-y-4">
                  {settings.visual.carouselItems.map((item, index) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-[20%]">
                        <IconPicker
                          value={item.icon}
                          onChange={(iconName) => {
                            const newItems = [...settings.visual.carouselItems]
                            newItems[index].icon = iconName
                            setSettings(prev => ({
                              ...prev,
                              visual: { ...prev.visual, carouselItems: newItems }
                            }))
                          }}
                        />
                      </div>
                      <Input
                        placeholder="Descrição"
                        value={item.description}
                        onChange={(e) => handleCarouselDescriptionChange(e, index)}
                        className="bg-slate-800/50 border-slate-700 text-slate-100 w-[60%]"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSettings(prev => ({
                            ...prev,
                            visual: {
                              ...prev.visual,
                              carouselItems: prev.visual.carouselItems.filter(i => i.id !== item.id)
                            }
                          }))
                        }}
                        className="bg-rose-950/50 hover:bg-rose-900 border-rose-800 text-rose-200 w-[20%]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Standard Texts Card */}
            <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/10 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-slate-100">Textos Padrão</CardTitle>
                <CardDescription className="text-slate-400">
                  Configure os textos padrão exibidos no app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-100">Título do valor liberado</Label>
                    <Input
                      placeholder="Digite o título..."
                      value={settings.visual.texts.releasedValueTitle}
                      onChange={(e) => {
                        setSettings(prev => ({
                          ...prev,
                          visual: {
                            ...prev.visual,
                            texts: { ...prev.visual.texts, releasedValueTitle: e.target.value }
                          }
                        }))
                      }}
                      className="bg-slate-800/50 border-slate-700 text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-100">Frase Inicial</Label>
                    <Input
                      placeholder="Digite a frase inicial..."
                      value={settings.visual.texts.initialPhrase}
                      onChange={(e) => {
                        setSettings(prev => ({
                          ...prev,
                          visual: {
                            ...prev.visual,
                            texts: { ...prev.visual.texts, initialPhrase: e.target.value }
                          }
                        }))
                      }}
                      className="bg-slate-800/50 border-slate-700 text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-100">Texto pré-registro</Label>
                    <Textarea
                      placeholder="Digite o texto pré-registro..."
                      value={settings.visual.texts.preRegistrationText}
                      onChange={(e) => {
                        setSettings(prev => ({
                          ...prev,
                          visual: {
                            ...prev.visual,
                            texts: { ...prev.visual.texts, preRegistrationText: e.target.value }
                          }
                        }))
                      }}
                      className="bg-slate-800/50 border-slate-700 text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-100">Texto de aceite</Label>
                    <Textarea
                      placeholder="Digite o texto de aceite..."
                      value={settings.visual.texts.acceptanceText}
                      onChange={(e) => {
                        setSettings(prev => ({
                          ...prev,
                          visual: {
                            ...prev.visual,
                            texts: { ...prev.visual.texts, acceptanceText: e.target.value }
                          }
                        }))
                      }}
                      className="bg-slate-800/50 border-slate-700 text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-100">Texto superior tela home</Label>
                    <Input
                      placeholder="Digite o texto superior..."
                      value={settings.visual.texts.homeTopText}
                      onChange={(e) => {
                        setSettings(prev => ({
                          ...prev,
                          visual: {
                            ...prev.visual,
                            texts: { ...prev.visual.texts, homeTopText: e.target.value }
                          }
                        }))
                      }}
                      className="bg-slate-800/50 border-slate-700 text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-100">Texto de formalização</Label>
                    <Textarea
                      placeholder="Digite o texto de formalização..."
                      value={settings.visual.texts.formalizationText}
                      onChange={(e) => {
                        setSettings(prev => ({
                          ...prev,
                          visual: {
                            ...prev.visual,
                            texts: { ...prev.visual.texts, formalizationText: e.target.value }
                          }
                        }))
                      }}
                      className="bg-slate-800/50 border-slate-700 text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-100">Texto do valor líquido</Label>
                    <Input
                      placeholder="Digite o texto do valor líquido..."
                      value={settings.visual.texts.netValueText}
                      onChange={(e) => {
                        setSettings(prev => ({
                          ...prev,
                          visual: {
                            ...prev.visual,
                            texts: { ...prev.visual.texts, netValueText: e.target.value }
                          }
                        }))
                      }}
                      className="bg-slate-800/50 border-slate-700 text-slate-100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="survey">
          <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-slate-100">Enquete</CardTitle>
              <CardDescription className="text-slate-400">
                Configure a enquete que será exibida no app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-slate-100">Título da Enquete</Label>
                <Input
                  placeholder="Digite o título da enquete..."
                  value={settings.survey.title}
                  onChange={(e) => {
                    setSettings(prev => ({
                      ...prev,
                      survey: { ...prev.survey, title: e.target.value }
                    }))
                  }}
                  className="bg-slate-800/50 border-slate-700 text-slate-100"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-slate-100">Opções da Enquete</Label>
                  {settings.survey.options.length < 5 && (
                    <Button
                      onClick={handleAddSurveyOption}
                      variant="outline"
                      size="sm"
                      className="bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-slate-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Opção
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  {settings.survey.options.map((option, index) => (
                    <div key={option.id} className="flex gap-4">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Nome da opção"
                          value={option.name}
                          onChange={(e) => handleSurveyOptionChange(e, index)}
                          className="bg-slate-800/50 border-slate-700 text-slate-100"
                        />
                        <p className="text-sm text-slate-400">
                          Slug: {option.slug}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSettings(prev => ({
                            ...prev,
                            survey: {
                              ...prev.survey,
                              options: prev.survey.options.filter(o => o.id !== option.id)
                            }
                          }))
                        }}
                        className="bg-rose-950/50 hover:bg-rose-900 border-rose-800 text-rose-200 h-10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="steps" className="space-y-4">
          <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-slate-100">Passo a Passo</CardTitle>
              <CardDescription className="text-slate-400">
                Configure os passos que serão exibidos no tutorial do app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.steps.items.map((step, index) => (
                <div key={step.id} className="space-y-4 p-4 rounded-lg bg-slate-800/50">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label className="text-slate-100 mb-2">Descrição do Passo {index + 1}</Label>
                      <Input
                        placeholder="Digite a descrição do passo..."
                        value={step.description}
                        onChange={(e) => handleStepDescriptionChange(e, index)}
                        className="bg-slate-800/50 border-slate-700 text-slate-100"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 bg-rose-950/50 hover:bg-rose-900 border-rose-800 text-rose-200"
                      onClick={() => {
                        const newSteps = settings.steps.items.filter((_, i) => i !== index)
                        setSettings(prev => ({
                          ...prev,
                          steps: { items: newSteps },
                        }))
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer">
                    <input type="file" className="hidden" accept="image/*" />
                    <Upload className="h-8 w-8 mx-auto text-slate-400" />
                    <p className="mt-2 text-sm text-slate-400">Arraste uma imagem ou clique para fazer upload</p>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={handleAddStep}
                className="w-full bg-slate-800/50 hover:bg-slate-700 border-slate-700 text-slate-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Passo
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help" className="space-y-4">
          <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-slate-100">Contato</CardTitle>
              <CardDescription className="text-slate-400">
                Configure os canais de contato disponíveis no app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Label className="text-slate-100">Informações de Contato</Label>
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <MessageSquare className="h-5 w-5 text-slate-400" />
                    <Input
                      placeholder="WhatsApp"
                      value={settings.help.contactInfo.whatsapp.value}
                      onChange={(e) => {
                        setSettings(prev => ({
                          ...prev,
                          help: {
                            ...prev.help,
                            contactInfo: {
                              ...prev.help.contactInfo,
                              whatsapp: { ...prev.help.contactInfo.whatsapp, value: e.target.value }
                            }
                          }
                        }))
                      }}
                      className="bg-slate-800/50 border-slate-700 text-slate-100"
                    />
                    <Switch
                      checked={settings.help.contactInfo.whatsapp.enabled}
                      onCheckedChange={(checked) => {
                        setSettings(prev => ({
                          ...prev,
                          help: {
                            ...prev.help,
                            contactInfo: {
                              ...prev.help.contactInfo,
                              whatsapp: { ...prev.help.contactInfo.whatsapp, enabled: checked }
                            }
                          }
                        }))
                      }}
                    />
                  </div>
                  <div className="flex gap-4 items-center">
                    <Mail className="h-5 w-5 text-slate-400" />
                    <Input
                      placeholder="Email"
                      value={settings.help.contactInfo.email.value}
                      onChange={(e) => {
                        setSettings(prev => ({
                          ...prev,
                          help: {
                            ...prev.help,
                            contactInfo: {
                              ...prev.help.contactInfo,
                              email: { ...prev.help.contactInfo.email, value: e.target.value }
                            }
                          }
                        }))
                      }}
                      className="bg-slate-800/50 border-slate-700 text-slate-100"
                    />
                    <Switch
                      checked={settings.help.contactInfo.email.enabled}
                      onCheckedChange={(checked) => {
                        setSettings(prev => ({
                          ...prev,
                          help: {
                            ...prev.help,
                            contactInfo: {
                              ...prev.help.contactInfo,
                              email: { ...prev.help.contactInfo.email, enabled: checked }
                            }
                          }
                        }))
                      }}
                    />
                  </div>
                  <div className="flex gap-4 items-center">
                    <Phone className="h-5 w-5 text-slate-400" />
                    <Input
                      placeholder="Telefone"
                      value={settings.help.contactInfo.phone.value}
                      onChange={(e) => {
                        setSettings(prev => ({
                          ...prev,
                          help: {
                            ...prev.help,
                            contactInfo: {
                              ...prev.help.contactInfo,
                              phone: { ...prev.help.contactInfo.phone, value: e.target.value }
                            }
                          }
                        }))
                      }}
                      className="bg-slate-800/50 border-slate-700 text-slate-100"
                    />
                    <Switch
                      checked={settings.help.contactInfo.phone.enabled}
                      onCheckedChange={(checked) => {
                        setSettings(prev => ({
                          ...prev,
                          help: {
                            ...prev.help,
                            contactInfo: {
                              ...prev.help.contactInfo,
                              phone: { ...prev.help.contactInfo.phone, enabled: checked }
                            }
                          }
                        }))
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-slate-100">FAQ</CardTitle>
              <CardDescription className="text-slate-400">
                Configure as perguntas frequentes exibidas no app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-slate-100">FAQ</Label>
                  <Button
                    onClick={handleAddFAQ}
                    variant="outline"
                    size="sm"
                    className="bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-slate-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Pergunta
                  </Button>
                </div>
                <div className="space-y-4">
                  {settings.help.faq.map((faq, index) => (
                    <div key={faq.id} className="space-y-2">
                      <div className="flex gap-4">
                        <Input
                          placeholder="Pergunta"
                          value={faq.question}
                          onChange={(e) => {
                            const newFAQ = [...settings.help.faq]
                            newFAQ[index].question = e.target.value
                            setSettings(prev => ({
                              ...prev,
                              help: { ...prev.help, faq: newFAQ }
                            }))
                          }}
                          className="bg-slate-800/50 border-slate-700 text-slate-100"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSettings(prev => ({
                              ...prev,
                              help: {
                                ...prev.help,
                                faq: prev.help.faq.filter(f => f.id !== faq.id)
                              }
                            }))
                          }}
                          className="bg-rose-950/50 hover:bg-rose-900 border-rose-800 text-rose-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        placeholder="Resposta"
                        value={faq.answer}
                        onChange={(e) => {
                          const newFAQ = [...settings.help.faq]
                          newFAQ[index].answer = e.target.value
                          setSettings(prev => ({
                            ...prev,
                            help: { ...prev.help, faq: newFAQ }
                          }))
                        }}
                        className="bg-slate-800/50 border-slate-700 text-slate-100"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/10 shadow-xl">
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-100">Nome da Empresa</Label>
                  <Input
                    value={settings.company.name}
                    onChange={(e) => {
                      setSettings(prev => ({
                        ...prev,
                        company: { ...prev.company, name: e.target.value }
                      }))
                    }}
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-100">CNPJ</Label>
                  <Input
                    value={settings.company.cnpj}
                    onChange={(e) => {
                      setSettings(prev => ({
                        ...prev,
                        company: { ...prev.company, cnpj: e.target.value }
                      }))
                    }}
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-100">Endereço</Label>
                  <Textarea
                    value={settings.company.address}
                    onChange={(e) => {
                      setSettings(prev => ({
                        ...prev,
                        company: { ...prev.company, address: e.target.value }
                      }))
                    }}
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-100">Telefone</Label>
                  <Input
                    value={settings.company.phone}
                    onChange={(e) => {
                      setSettings(prev => ({
                        ...prev,
                        company: { ...prev.company, phone: e.target.value }
                      }))
                    }}
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-100">E-mail</Label>
                  <Input
                    value={settings.company.email}
                    onChange={(e) => {
                      setSettings(prev => ({
                        ...prev,
                        company: { ...prev.company, email: e.target.value }
                      }))
                    }}
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-100">Servidor de E-mail</Label>
                  <Input
                    value={settings.company.mailServer}
                    onChange={(e) => {
                      setSettings(prev => ({
                        ...prev,
                        company: { ...prev.company, mailServer: e.target.value }
                      }))
                    }}
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button className="bg-primary-600 hover:bg-primary-700 text-white">
          Salvar Configurações
        </Button>
      </div>
    </div>
  )
} 
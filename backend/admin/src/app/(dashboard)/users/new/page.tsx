'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Eye, EyeOff, Wand2, User, FileText, MapPin, Building2, Settings } from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select"
import { Role, DocumentType, BankAccountType, PixKeyType } from '@prisma/client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Label } from '@/components/ui/label'
import { formatCPF, cleanCPF } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface FormData {
  name: string
  email?: string
  cpf: string
  phone?: string
  role: Role
  password?: string
  motherName?: string
  documentType?: DocumentType
  documentNumber?: string
  documentIssuer?: string
  address?: string
  addressNumber?: string
  complement?: string
  neighborhood?: string
  city?: string
  state?: string
  zipCode?: string
  bankType?: BankAccountType
  bankCode?: string
  bankDigit?: string
  agency?: string
  agencyDigit?: string
  accountNumber?: string
  pixKeyType?: PixKeyType
  pixKey?: string
  referralUserId?: string
  documentIssueDate?: string
  documentIssuerState?: string
  gender?: string
  education?: string
  maritalStatus?: string
  bankParameters?: {
    commissionRates?: {
      standard?: number
      special?: number
    }
    paymentTerms?: {
      frequency?: string
      dayOfMonth?: number
    }
    bankingPreferences?: {
      preferredPaymentMethod?: string
      minimumPayout?: number
    }
  }
}

interface User {
  id: string
  numId: number
  name: string
  email: string | null
  cpf: string
  phone: string | null
  role: Role
  createdAt: string
}

export default function NewUserPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [brokers, setBrokers] = useState<{ id: string; user: { name: string } }[]>([])

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      role: Role.USER,
      bankParameters: {
        commissionRates: {
          standard: 2.5,
          special: 3.0
        },
        paymentTerms: {
          frequency: 'monthly',
          dayOfMonth: 5
        },
        bankingPreferences: {
          preferredPaymentMethod: 'pix',
          minimumPayout: 100
        }
      }
    }
  })
  
  const role = watch('role')

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const response = await fetch('/api/users?role=BROKER')
        if (response.ok) {
          const data = await response.json() as User[]
          setBrokers(data.map(user => ({ id: user.id, user: { name: user.name } })))
        }
      } catch (error) {
        console.error('Erro ao carregar corretores:', error)
      }
    }

    fetchBrokers()
  }, [])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError('')

    try {
      // Validate required fields
      if (!data.name?.trim()) {
        throw new Error('Nome é obrigatório')
      }

      if (!data.cpf?.trim()) {
        throw new Error('CPF é obrigatório')
      }

      // Validate password for admin users
      if (data.role === Role.ADMIN && !data.password) {
        throw new Error('Senha é obrigatória para administradores')
      }

      // Clean CPF before sending
      const cleanedData = {
        ...data,
        name: data.name.trim(),
        cpf: cleanCPF(data.cpf),
        // Convert bankParameters to string if it's an object
        bankParameters: typeof data.bankParameters === 'object' 
          ? JSON.stringify(data.bankParameters)
          : data.bankParameters,
        // Convert referralUserId "none" to null
        referralUserId: data.referralUserId === 'none' ? null : data.referralUserId
      }

      console.log('Submitting data:', cleanedData)

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'Erro ao criar usuário')
      }

      toast.success('Usuário criado com sucesso!')
      router.push('/users')
      router.refresh()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
        toast.error(error.message)
      } else {
        setError('Erro ao criar usuário')
        toast.error('Erro ao criar usuário')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const cleanedValue = cleanCPF(value)
    if (cleanedValue.length > 11) return
    setValue('cpf', formatCPF(cleanedValue))
  }

  const generatePassword = () => {
    const length = 12
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setValue('password', password)
  }

  return (
    <div className="space-y-6 p-1 sm:p-4 animate-in fade-in duration-500">
      {/* Header Card */}
      <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/10 shadow-xl">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.back()}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-slate-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <CardTitle className="text-xl text-slate-100">Novo Usuário</CardTitle>
                <CardDescription className="text-slate-400">
                  Preencha os dados para criar um novo usuário
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 sm:flex-none bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-slate-100"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="user-form"
                disabled={loading}
                className="flex-1 sm:flex-none bg-primary-600 text-white hover:bg-primary-700"
              >
                {loading ? 'Criando...' : 'Criar Usuário'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <form id="user-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full justify-start bg-slate-800/50 border border-slate-200/10">
            <TabsTrigger value="general" className="gap-2 data-[state=active]:bg-slate-700 text-slate-100">
              <User className="h-4 w-4" />
              Dados Gerais
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2 data-[state=active]:bg-slate-700 text-slate-100">
              <FileText className="h-4 w-4" />
              Documentos
            </TabsTrigger>
            <TabsTrigger value="address" className="gap-2 data-[state=active]:bg-slate-700 text-slate-100">
              <MapPin className="h-4 w-4" />
              Endereço
            </TabsTrigger>
            <TabsTrigger value="bank" className="gap-2 data-[state=active]:bg-slate-700 text-slate-100">
              <Building2 className="h-4 w-4" />
              Dados Bancários
            </TabsTrigger>
            <TabsTrigger value="parameters" className="gap-2 data-[state=active]:bg-slate-700 text-slate-100">
              <Settings className="h-4 w-4" />
              Parâmetros
            </TabsTrigger>
          </TabsList>

          {/* Dados Gerais */}
          <TabsContent value="general" className="mt-4">
            <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/10 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg text-slate-100">Informações Básicas</CardTitle>
                <CardDescription className="text-slate-400">
                  Dados principais do usuário
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-100">
                      Nome <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register('name', { 
                        required: 'Nome é obrigatório',
                        minLength: { value: 3, message: 'Nome deve ter no mínimo 3 caracteres' }
                      })}
                      className={cn(
                        "bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-400",
                        errors.name && "border-red-500 focus-visible:ring-red-500"
                      )}
                      placeholder="Digite o nome completo"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-100">Email</Label>
                    <Input
                      type="email"
                      {...register('email')}
                      className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf" className="text-slate-100">CPF</Label>
                    <Input
                      {...register('cpf', { 
                        required: true,
                        validate: (value) => {
                          const cleaned = cleanCPF(value)
                          return cleaned.length === 11 || 'CPF inválido'
                        }
                      })}
                      onChange={handleCPFChange}
                      placeholder="000.000.000-00"
                      className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-400"
                    />
                    {errors.cpf && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.cpf.type === 'required' ? 'CPF é obrigatório' : errors.cpf.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-100">Telefone</Label>
                    <Input
                      {...register('phone')}
                      className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-slate-100">Cargo</Label>
                    <Select
                      {...register('role')}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500">
                        <SelectValue placeholder="Selecione o cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Role.ADMIN}>Administrador</SelectItem>
                        <SelectItem value={Role.BROKER}>Corretor</SelectItem>
                        <SelectItem value={Role.SUPPORT}>Suporte</SelectItem>
                        <SelectItem value={Role.USER}>Usuário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-100">Senha</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        className="bg-slate-800/50 border-slate-700 text-slate-100"
                        {...register('password')}
                        required={role === Role.ADMIN}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={generatePassword}
                          className="h-7 w-7 text-slate-400 hover:text-slate-100"
                        >
                          <Wand2 className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowPassword(!showPassword)}
                          className="h-7 w-7 text-slate-400 hover:text-slate-100"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referralUserId" className="text-slate-100">Corretor Indicador</Label>
                    <Select
                      {...register('referralUserId')}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500">
                        <SelectValue placeholder="Selecione um corretor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum</SelectItem>
                        {brokers.map((broker) => (
                          <SelectItem key={broker.id} value={broker.id}>
                            {broker.user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentos */}
          <TabsContent value="documents" className="mt-4">
            <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/10 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg text-slate-100">Documentação</CardTitle>
                <CardDescription className="text-slate-400">
                  Documentos e informações pessoais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="motherName" className="text-slate-100">Nome da Mãe</Label>
                    <Input
                      {...register('motherName')}
                      className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documentType" className="text-slate-100">Tipo de Documento</Label>
                    <Select
                      {...register('documentType')}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RG">RG</SelectItem>
                        <SelectItem value="CNH">CNH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documentNumber" className="text-slate-100">Número do Documento</Label>
                    <Input
                      {...register('documentNumber')}
                      className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documentIssuer" className="text-slate-100">Órgão Emissor</Label>
                    <Input
                      {...register('documentIssuer')}
                      className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documentIssueDate" className="text-slate-100">Data de Expedição</Label>
                    <Input
                      {...register('documentIssueDate')}
                      className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documentIssuerState" className="text-slate-100">Estado Emissor</Label>
                    <Select
                      {...register('documentIssuerState')}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500">
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AC">Acre</SelectItem>
                        <SelectItem value="AL">Alagoas</SelectItem>
                        <SelectItem value="AP">Amapá</SelectItem>
                        <SelectItem value="AM">Amazonas</SelectItem>
                        <SelectItem value="BA">Bahia</SelectItem>
                        <SelectItem value="CE">Ceará</SelectItem>
                        <SelectItem value="DF">Distrito Federal</SelectItem>
                        <SelectItem value="ES">Espírito Santo</SelectItem>
                        <SelectItem value="GO">Goiás</SelectItem>
                        <SelectItem value="MA">Maranhão</SelectItem>
                        <SelectItem value="MT">Mato Grosso</SelectItem>
                        <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                        <SelectItem value="PA">Pará</SelectItem>
                        <SelectItem value="PB">Paraíba</SelectItem>
                        <SelectItem value="PR">Paraná</SelectItem>
                        <SelectItem value="PE">Pernambuco</SelectItem>
                        <SelectItem value="PI">Piauí</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                        <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                        <SelectItem value="RO">Rondônia</SelectItem>
                        <SelectItem value="RR">Roraima</SelectItem>
                        <SelectItem value="SC">Santa Catarina</SelectItem>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="SE">Sergipe</SelectItem>
                        <SelectItem value="TO">Tocantins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-slate-100">Gênero</Label>
                    <Select
                      {...register('gender')}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500">
                        <SelectValue placeholder="Selecione o gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Feminino</SelectItem>
                        <SelectItem value="O">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education" className="text-slate-100">Escolaridade</Label>
                    <Select
                      {...register('education')}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500">
                        <SelectValue placeholder="Selecione a escolaridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FUNDAMENTAL_INCOMPLETO">Fundamental Incompleto</SelectItem>
                        <SelectItem value="FUNDAMENTAL_COMPLETO">Fundamental Completo</SelectItem>
                        <SelectItem value="MEDIO_INCOMPLETO">Médio Incompleto</SelectItem>
                        <SelectItem value="MEDIO_COMPLETO">Médio Completo</SelectItem>
                        <SelectItem value="SUPERIOR_INCOMPLETO">Superior Incompleto</SelectItem>
                        <SelectItem value="SUPERIOR_COMPLETO">Superior Completo</SelectItem>
                        <SelectItem value="POS_GRADUACAO">Pós-graduação</SelectItem>
                        <SelectItem value="MESTRADO">Mestrado</SelectItem>
                        <SelectItem value="DOUTORADO">Doutorado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maritalStatus" className="text-slate-100">Estado Civil</Label>
                    <Select
                      {...register('maritalStatus')}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500">
                        <SelectValue placeholder="Selecione o estado civil" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SOLTEIRO">Solteiro(a)</SelectItem>
                        <SelectItem value="CASADO">Casado(a)</SelectItem>
                        <SelectItem value="DIVORCIADO">Divorciado(a)</SelectItem>
                        <SelectItem value="VIUVO">Viúvo(a)</SelectItem>
                        <SelectItem value="SEPARADO">Separado(a)</SelectItem>
                        <SelectItem value="UNIAO_ESTAVEL">União Estável</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Endereço */}
          <TabsContent value="address" className="mt-4">
            <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/10 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg text-slate-100">Endereço</CardTitle>
                <CardDescription className="text-slate-400">
                  Informações de localização
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-slate-100">Endereço</Label>
                    <Input
                      {...register('address')}
                      className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressNumber" className="text-slate-100">Número</Label>
                    <Input
                      {...register('addressNumber')}
                      className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complement" className="text-slate-100">Complemento</Label>
                    <Input
                      {...register('complement')}
                      className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood" className="text-slate-100">Bairro</Label>
                    <Input
                      {...register('neighborhood')}
                      className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-slate-100">Cidade</Label>
                    <Input
                      {...register('city')}
                      className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-slate-100">Estado</Label>
                    <Input
                      {...register('state')}
                      className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="text-slate-100">CEP</Label>
                    <Input
                      {...register('zipCode')}
                      className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dados Bancários */}
          <TabsContent value="bank" className="mt-4">
            <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/10 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg text-slate-100">Dados Bancários</CardTitle>
                <CardDescription className="text-slate-400">
                  Informações bancárias e PIX
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankType" className="text-slate-100">Tipo de Conta</Label>
                    <Select
                      {...register('bankType')}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={BankAccountType.CHECKING}>Conta Corrente</SelectItem>
                        <SelectItem value={BankAccountType.SAVINGS}>Conta Poupança</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankCode" className="text-slate-100">Banco</Label>
                    <Input
                      {...register('bankCode')}
                      className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankDigit" className="text-slate-100">Dígito do Banco</Label>
                    <Input
                      {...register('bankDigit')}
                      className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agency" className="text-slate-100">Agência</Label>
                    <Input
                      {...register('agency')}
                      className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agencyDigit" className="text-slate-100">Dígito da Agência</Label>
                    <Input
                      {...register('agencyDigit')}
                      className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber" className="text-slate-100">Número da Conta</Label>
                    <Input
                      {...register('accountNumber')}
                      className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pixKeyType" className="text-slate-100">Tipo de Chave PIX</Label>
                    <Select
                      {...register('pixKeyType')}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={PixKeyType.CPF}>CPF</SelectItem>
                        <SelectItem value={PixKeyType.EMAIL}>Email</SelectItem>
                        <SelectItem value={PixKeyType.PHONE}>Telefone</SelectItem>
                        <SelectItem value={PixKeyType.RANDOM}>Chave Aleatória</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pixKey" className="text-slate-100">Chave PIX</Label>
                    <Input
                      {...register('pixKey')}
                      className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:border-slate-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Parâmetros */}
          <TabsContent value="parameters" className="mt-4">
            <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/10 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg text-slate-100">Parâmetros Bancários</CardTitle>
                <CardDescription className="text-slate-400">
                  Configurações de comissões e pagamentos em formato JSON
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bankParameters" className="text-slate-100">Parâmetros (JSON)</Label>
                  <textarea
                    id="bankParameters"
                    rows={20}
                    {...register('bankParameters')}
                    className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300"
                    placeholder="Digite o JSON dos parâmetros bancários"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
} 
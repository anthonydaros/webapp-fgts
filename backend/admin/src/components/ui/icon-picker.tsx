'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Button } from './button'
import { Input } from './input'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Banknote,
  Building,
  Car,
  User,
  Award,
  Coins,
  Tag,
  SmilePlus,
  ThumbsUp,
  TrendingUp,
  Clock,
  Shield,
  Calendar,
  Home,
  CreditCard,
  Wallet,
  PiggyBank,
  DollarSign,
  BadgeCheck,
  Gift,
  Heart,
  Star,
  Trophy,
  Target,
  Zap,
  Crown,
  Diamond,
  Gem,
  Key,
  Lock,
  Unlock,
  CheckCircle,
  Clock3,
  Clock4,
  Timer,
  Hourglass,
  CalendarDays,
  CalendarCheck,
  CalendarClock,
  CalendarRange,
  UserCheck,
  UserPlus,
  Users,
  UserCircle,
  Medal,
  Sparkles,
  PartyPopper,
  Rocket,
  Lightbulb,
  Flame,
  Gauge,
  Activity,
  LineChart,
  BarChart,
  PieChart,
  Landmark,
  Building2,
  CircleDollarSign,
  Percent,
  Receipt,
  Smartphone,
  Mail,
  MessageSquare,
  BellRing,
  FileText,
  FileCheck,
  FileSearch,
} from 'lucide-react'

const icons = [
  { name: 'Dinheiro', icon: Banknote },
  { name: 'Prédio', icon: Building },
  { name: 'Carro', icon: Car },
  { name: 'Pessoa', icon: User },
  { name: 'Selo', icon: Award },
  { name: 'Moedas', icon: Coins },
  { name: 'Etiqueta', icon: Tag },
  { name: 'Feliz', icon: SmilePlus },
  { name: 'Positivo', icon: ThumbsUp },
  { name: 'Nível', icon: TrendingUp },
  { name: 'Relógio', icon: Clock },
  { name: 'Segurança', icon: Shield },
  { name: 'Calendário', icon: Calendar },
  { name: 'Casa', icon: Home },
  { name: 'Cartão', icon: CreditCard },
  { name: 'Carteira', icon: Wallet },
  { name: 'Cofrinho', icon: PiggyBank },
  { name: 'Dólar', icon: DollarSign },
  { name: 'Verificado', icon: BadgeCheck },
  { name: 'Presente', icon: Gift },
  { name: 'Coração', icon: Heart },
  { name: 'Estrela', icon: Star },
  { name: 'Troféu', icon: Trophy },
  { name: 'Alvo', icon: Target },
  { name: 'Raio', icon: Zap },
  { name: 'Coroa', icon: Crown },
  { name: 'Diamante', icon: Diamond },
  { name: 'Jóia', icon: Gem },
  { name: 'Chave', icon: Key },
  { name: 'Bloqueado', icon: Lock },
  { name: 'Desbloqueado', icon: Unlock },
  { name: 'Confirmado', icon: CheckCircle },
  { name: 'Relógio 3', icon: Clock3 },
  { name: 'Relógio 4', icon: Clock4 },
  { name: 'Timer', icon: Timer },
  { name: 'Ampulheta', icon: Hourglass },
  { name: 'Dias', icon: CalendarDays },
  { name: 'Agenda', icon: CalendarCheck },
  { name: 'Horário', icon: CalendarClock },
  { name: 'Período', icon: CalendarRange },
  { name: 'Usuário OK', icon: UserCheck },
  { name: 'Novo Usuário', icon: UserPlus },
  { name: 'Usuários', icon: Users },
  { name: 'Perfil', icon: UserCircle },
  { name: 'Medalha', icon: Medal },
  { name: 'Brilho', icon: Sparkles },
  { name: 'Festa', icon: PartyPopper },
  { name: 'Foguete', icon: Rocket },
  { name: 'Ideia', icon: Lightbulb },
  { name: 'Chama', icon: Flame },
  { name: 'Medidor', icon: Gauge },
  { name: 'Atividade', icon: Activity },
  { name: 'Gráfico Linha', icon: LineChart },
  { name: 'Gráfico Barra', icon: BarChart },
  { name: 'Gráfico Pizza', icon: PieChart },
  { name: 'Banco', icon: Landmark },
  { name: 'Empresa', icon: Building2 },
  { name: 'Círculo Dólar', icon: CircleDollarSign },
  { name: 'Porcentagem', icon: Percent },
  { name: 'Recibo', icon: Receipt },
  { name: 'Celular', icon: Smartphone },
  { name: 'Email', icon: Mail },
  { name: 'Mensagem', icon: MessageSquare },
  { name: 'Notificação', icon: BellRing },
  { name: 'Documento', icon: FileText },
  { name: 'Documento OK', icon: FileCheck },
  { name: 'Buscar Doc', icon: FileSearch },
]

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-700 bg-slate-900 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

interface IconPickerProps {
  value: string
  onChange: (iconName: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [search, setSearch] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(false)

  const filteredIcons = icons.filter(icon =>
    icon.name.toLowerCase().includes(search.toLowerCase())
  )

  const selectedIcon = icons.find(icon => icon.name === value)
  const IconComponent = selectedIcon?.icon || User

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-10 bg-slate-800/50 border-slate-700 text-slate-100 justify-start gap-2"
        >
          <IconComponent className="h-4 w-4 text-slate-100" />
          {value || 'Selecione um ícone'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Buscar ícones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-slate-100"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {filteredIcons.map((icon) => (
              <DialogClose key={icon.name} asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'h-16 flex flex-col items-center justify-center gap-1 bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-slate-100',
                    value === icon.name && 'ring-2 ring-primary-500 border-primary-500'
                  )}
                  onClick={() => onChange(icon.name)}
                >
                  <icon.icon className="h-6 w-6 text-slate-100" />
                  <span className="text-xs text-slate-100">{icon.name}</span>
                </Button>
              </DialogClose>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCPF(cpf: string): string {
  if (!cpf) return ''
  // Remove tudo que não é número
  const cleanCPF = cpf.replace(/\D/g, '')
  
  // Aplica a máscara
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export function cleanCPF(cpf: string): string {
  if (!cpf) return ''
  // Remove tudo que não é número
  return cpf.replace(/\D/g, '')
} 
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient, UserRole } from '@prisma/client'
import { authOptions } from '../../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verifica a sessão do usuário
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Não autorizado', { status: 401 })
    }

    // Apenas administradores podem excluir usuários
    if (session.user.role !== UserRole.ADMIN) {
      return new NextResponse('Acesso negado', { status: 403 })
    }

    const userId = params.id

    // Busca o usuário para verificar se existe e se é admin
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return new NextResponse('Usuário não encontrado', { status: 404 })
    }

    // Não permite excluir administradores
    if (user.role === UserRole.ADMIN) {
      return new NextResponse('Não é permitido excluir administradores', { status: 403 })
    }

    // Exclui o usuário
    await prisma.user.delete({
      where: { id: userId }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Erro ao excluir usuário:', error)
    return new NextResponse('Erro interno do servidor', { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 
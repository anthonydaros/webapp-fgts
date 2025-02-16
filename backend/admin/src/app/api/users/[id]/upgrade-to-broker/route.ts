import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient, UserRole } from '@prisma/client'
import { authOptions } from '../../../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Verificar permissão de admin
    if (session.user.role !== UserRole.ADMIN) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const { id } = params

    // Buscar usuário e verificar existência
    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Verificar se já é broker
    if (user.role === UserRole.BROKER) {
      return new NextResponse('User is already a broker', { status: 400 })
    }

    // Atualizar usuário para broker
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        role: UserRole.BROKER
      }
    })

    // Registrar atividade
    await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'CREATE_BROKER',
        description: `User ${user.name} (ID: ${user.id}) upgraded to broker by ${session.user.name}`
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error upgrading user to broker:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: errorMessage }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  } finally {
    await prisma.$disconnect()
  }
} 
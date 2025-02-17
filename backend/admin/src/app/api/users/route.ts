import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient, UserRole, Status } from '@prisma/client'
import { authOptions } from '../auth/[...nextauth]/route'
import bcrypt from 'bcryptjs'
import { cleanCPF } from '@/lib/utils'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    console.log('Iniciando requisição GET /api/users')
    const session = await getServerSession(authOptions)
    console.log('Sessão encontrada:', session)

    if (!session) {
      console.log('Sem sessão, retornando 401')
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get role from query params
    const { searchParams } = new URL(request.url)
    const roleFilter = searchParams.get('role')

    console.log('Buscando usuários no banco de dados...')
    const users = await prisma.user.findMany({
      where: roleFilter ? {
        role: UserRole[roleFilter as keyof typeof UserRole]
      } : {
        role: {
          not: UserRole.USER
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        referralUser: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const usersWithReferrals = users.map(user => ({
      ...user,
      referralUser: user.referralUser ? { name: user.referralUser.name } : null
    }))

    console.log('Usuários encontrados:', usersWithReferrals.length)

    return NextResponse.json(usersWithReferrals)
  } catch (error) {
    console.error('Erro detalhado ao buscar usuários:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: errorMessage }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const data = await request.json()
    console.log('Received data:', JSON.stringify(data, null, 2))

    // Validate CPF before cleaning
    if (!data.cpf) {
      return new NextResponse(JSON.stringify({ error: 'CPF é obrigatório' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const cleanedCPF = cleanCPF(data.cpf)
    console.log('Cleaned CPF:', cleanedCPF)

    // Validate required fields
    if (!data.name) {
      return new NextResponse(JSON.stringify({ error: 'Nome é obrigatório' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Check for unique CPF
    const existingCpf = await prisma.user.findFirst({
      where: { cpf: cleanedCPF }
    })

    if (existingCpf) {
      return new NextResponse(JSON.stringify({ error: 'CPF já cadastrado' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Check for unique email if provided
    if (data.email) {
      const existingEmail = await prisma.user.findFirst({
        where: { email: data.email }
      })

      if (existingEmail) {
        return new NextResponse(JSON.stringify({ error: 'Email já cadastrado' }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }

    // Hash password if provided
    const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : undefined

    // Process bank parameters
    let bankParameters = undefined
    if (data.bankParameters) {
      if (typeof data.bankParameters === 'string') {
        try {
          bankParameters = JSON.parse(data.bankParameters)
        } catch (error) {
          console.error('Error parsing bankParameters:', error)
          return new NextResponse(JSON.stringify({ error: 'Parâmetros bancários inválidos' }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      } else {
        bankParameters = data.bankParameters
      }
    }

    // Create base user data
    const userData = {
      name: data.name,
      email: data.email,
      cpf: cleanedCPF,
      phone: data.phone,
      password: hashedPassword || '',
      role: data.role as UserRole || UserRole.USER,
      status: Status.ACTIVE,
      motherName: data.motherName,
      documentType: data.documentType,
      documentNumber: data.documentNumber,
      documentIssuer: data.documentIssuer,
      address: data.address,
      addressNumber: data.addressNumber,
      complement: data.complement,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      bankType: data.bankType,
      bankCode: data.bankCode,
      bankDigit: data.bankDigit,
      agency: data.agency,
      agencyDigit: data.agencyDigit,
      accountNumber: data.accountNumber,
      pixKeyType: data.pixKeyType,
      pixKey: data.pixKey,
      referralUserId: data.referralUserId,
      bankParameters: bankParameters
    }

    console.log('Creating user with data:', { ...userData, password: '[REDACTED]' })

    // Create user
    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true
      }
    })

    // Update seller URL for brokers after creation
    if (data.role === UserRole.BROKER) {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          sellerUrl: `http://localhost:3000/seller=${user.id}`
        },
        select: {
          id: true,
          name: true,
          email: true,
          cpf: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
          sellerUrl: true
        }
      })
      return NextResponse.json(updatedUser)
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Detailed error creating user:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new NextResponse(JSON.stringify({ error: 'Erro ao criar usuário', details: errorMessage }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  } finally {
    await prisma.$disconnect()
  }
} 
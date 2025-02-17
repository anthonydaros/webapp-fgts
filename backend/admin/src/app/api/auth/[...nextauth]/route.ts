<<<<<<< HEAD
import { PrismaClient } from '@prisma/client'
import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          console.log('Iniciando autenticação...')

          if (!credentials?.email || !credentials?.password) {
            console.log('Credenciais ausentes')
            throw new Error('Invalid credentials')
          }

          console.log('Buscando usuário:', credentials.email)
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              role: true
            }
          })

          if (!user || !user.password) {
            console.log('Usuário não encontrado')
            throw new Error('Invalid credentials')
          }

          console.log('Verificando senha...')
          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          )

          console.log('Senha correta?', isCorrectPassword)
          if (!isCorrectPassword) {
            throw new Error('Invalid credentials')
          }

          console.log('Autenticação bem-sucedida')
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('Erro na autenticação:', error)
          throw error
        } finally {
          await prisma.$disconnect()
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        }
      }
    }
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 
=======
import { PrismaClient } from '@prisma/client'
import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          console.log('Iniciando autenticação...')

          if (!credentials?.email || !credentials?.password) {
            console.log('Credenciais ausentes')
            throw new Error('Invalid credentials')
          }

          console.log('Buscando usuário:', credentials.email)
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              role: true
            }
          })

          if (!user || !user.password) {
            console.log('Usuário não encontrado')
            throw new Error('Invalid credentials')
          }

          console.log('Verificando senha...')
          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          )

          console.log('Senha correta?', isCorrectPassword)
          if (!isCorrectPassword) {
            throw new Error('Invalid credentials')
          }

          console.log('Autenticação bem-sucedida')
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('Erro na autenticação:', error)
          throw error
        } finally {
          await prisma.$disconnect()
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        }
      }
    }
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST, authOptions } 
>>>>>>> 4f526c9549991f16d1bb411a9d145f5e8ba60860

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const ADMIN_ROUTES = [
  '/dashboard',
  '/brokers',
  '/proposals',
  '/users',
  '/settings',
  '/logs',
]

const BROKER_ROUTES = [
  '/proposals',
]

const SUPPORT_ROUTES = [
  '/dashboard',
  '/brokers',
  '/proposals',
  '/users',
]

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  const path = request.nextUrl.pathname
  const role = token.role as string
  const settings = token.settings as { general: { brokerAdminAccess: boolean } }

  // Admin has full access
  if (role === 'ADMIN') {
    return NextResponse.next()
  }

  // Regular user has no access to admin panel
  if (role === 'USER') {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Broker access only to proposals if brokerAdminAccess is enabled
  if (role === 'BROKER') {
    if (!settings?.general?.brokerAdminAccess) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    if (!BROKER_ROUTES.some(route => path.startsWith(route))) {
      return NextResponse.redirect(new URL('/proposals', request.url))
    }
  }

  // Support access to specific routes
  if (role === 'SUPPORT') {
    if (!SUPPORT_ROUTES.some(route => path.startsWith(route))) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Prevent support from accessing admin users in the users page
    if (path.startsWith('/users')) {
      const searchParams = request.nextUrl.searchParams
      if (searchParams.get('role') === 'ADMIN') {
        return NextResponse.redirect(new URL('/users', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/brokers/:path*',
    '/proposals/:path*',
    '/users/:path*',
    '/settings/:path*',
    '/logs/:path*',
  ],
} 
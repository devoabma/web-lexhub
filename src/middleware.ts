import { jwtDecode } from 'jwt-decode'
import { type NextRequest, NextResponse } from 'next/server'

const publicRoutes = [
  { path: '/', whenAuthenticated: 'redirect' },
  { path: '/forgot-password', whenAuthenticated: 'redirect' },
  { path: '/reset-password', whenAuthenticated: 'redirect' },
  { path: '/confirm-send-email', whenAuthenticated: 'redirect' },
] as const
const adminRoutes = [
  { path: '/services-types', whenAuthenticated: 'redirect' },
  { path: '/agents', whenAuthenticated: 'redirect' },
  { path: '/services', whenAuthenticated: 'next' },
] as const

// Redireciona o usuário caso ele acesse uma rota privada sem estar logado
const REDIRECT_WHEN_NOT_LOGGED_IN = '/'

interface JWTTokenProps {
  role: 'ADMIN' | 'MEMBER'
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const publicRoute = publicRoutes.find(route => route.path === path)
  const adminRoute = adminRoutes.find(route => route.path === path)

  const authToken = request.cookies.get('@lexhub-auth')

  console.log('🔍 Path:', path)
  console.log('🔑 Token encontrado:', authToken)

  // Se o usuário não estiver logado e a rota for publica, ele pode acessar
  if (!authToken && publicRoute) {
    return NextResponse.next()
  }

  // Se o usuário não estiver logado e a rota for privada, ele deve ser redirecionado
  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone()

    redirectUrl.pathname = REDIRECT_WHEN_NOT_LOGGED_IN

    return NextResponse.redirect(redirectUrl)
  }

  // Se o usuário estiver logado e a rota for publica, ele deve ser redirecionado para a rota privada
  if (
    authToken &&
    publicRoute &&
    publicRoute.whenAuthenticated === 'redirect'
  ) {
    const redirectUrl = request.nextUrl.clone()

    redirectUrl.pathname = '/dashboard'

    return NextResponse.redirect(redirectUrl)
  }

  // Se o usuário estiver logado e a rota for privada, mas não seja admin, ele deve ser redirecionado para a rota privada /dashboard
  if (
    authToken &&
    adminRoutes &&
    adminRoute?.whenAuthenticated === 'redirect'
  ) {
    const token: JWTTokenProps = jwtDecode(authToken.value)

    if (token.role !== 'ADMIN') {
      const redirectUrl = request.nextUrl.clone()

      redirectUrl.pathname = '/dashboard'

      return NextResponse.redirect(redirectUrl)
    }
  }

  // Se o usuário estiver logado e a rota for privada, so acessará se o token estiver valido
  if (authToken && !publicRoute) {
    const token = jwtDecode(authToken.value)

    if (token.exp && token.exp * 1000 < Date.now()) {
      // Remove o cookie de autenticação se o token estiver expirado
      const redirectUrl = request.nextUrl.clone()

      redirectUrl.pathname = REDIRECT_WHEN_NOT_LOGGED_IN

      const response = NextResponse.redirect(redirectUrl)

      console.log(response)

      response.cookies.delete('@lexhub-auth')

      return response
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|fonts|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}

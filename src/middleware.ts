import { jwtDecode } from 'jwt-decode'
import { type NextRequest, NextResponse } from 'next/server'
import { env } from './env'

const AUTH_COOKIE = '@lexhub-auth'

const publicRoutes = [
  '/',
  '/forgot-password',
  '/reset-password',
  '/confirm-send-email',
]

// Rotas exclusivas de administrador; as subrotas (ex.: /agents/123) herdam a regra
const adminRoutes = ['/agents', '/services-types']

// Redireciona o usuário caso ele acesse uma rota privada sem estar logado
const REDIRECT_WHEN_NOT_LOGGED_IN = '/'

// Redireciona o usuário logado que acessa uma rota pública ou sem permissão
const REDIRECT_WHEN_LOGGED_IN = '/dashboard'

interface JWTTokenProps {
  sub: string
  role: 'ADMIN' | 'MEMBER'
  exp: number
}

// Decodifica o JWT sem verificar a assinatura: serve só para a UI, a API
// valida assinatura e papel em todo endpoint. Token malformado, sem `exp` ou
// expirado é tratado como sessão inválida
function getSession(token: string) {
  try {
    const session = jwtDecode<JWTTokenProps>(token)

    if (typeof session.exp !== 'number' || session.exp * 1000 <= Date.now()) {
      return null
    }

    return session
  } catch {
    return null
  }
}

function isAdminRoute(path: string) {
  return adminRoutes.some(
    route => path === route || path.startsWith(`${route}/`)
  )
}

function redirectTo(request: NextRequest, pathname: string) {
  const redirectUrl = request.nextUrl.clone()

  redirectUrl.pathname = pathname
  redirectUrl.search = ''

  return NextResponse.redirect(redirectUrl)
}

// Apaga o cookie com o mesmo domain e path com que a API o grava e também a
// variante sem domain (cookies antigos, regravados pelo middleware)
function clearAuthCookie(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE, '', {
    path: '/',
    domain: env.NEXT_PUBLIC_DOMAIN,
    maxAge: 0,
  })

  // `response.cookies` guarda um cookie por nome e regrava todos os
  // Set-Cookie a cada `set`: a variante sem domain vai direto no header e
  // precisa ser a última escrita de cookie da resposta
  response.headers.append('Set-Cookie', `${AUTH_COOKIE}=; Path=/; Max-Age=0`)

  return response
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicRoute = publicRoutes.includes(path)

  const authCookie = request.cookies.get(AUTH_COOKIE)
  const session = authCookie ? getSession(authCookie.value) : null

  // Sem sessão válida: rota pública abre normalmente (nunca redireciona `/`
  // para `/`) e rota privada volta para o login
  if (!session) {
    const response = isPublicRoute
      ? NextResponse.next()
      : redirectTo(request, REDIRECT_WHEN_NOT_LOGGED_IN)

    // Cookie malformado ou expirado é removido para não ser reenviado
    return authCookie ? clearAuthCookie(response) : response
  }

  // Se o usuário estiver logado e a rota for pública, ele deve ser redirecionado para a rota privada
  if (isPublicRoute) {
    return redirectTo(request, REDIRECT_WHEN_LOGGED_IN)
  }

  // Se o usuário estiver logado e a rota for de admin, mas ele não seja admin, é redirecionado para /dashboard
  if (isAdminRoute(path) && session.role !== 'ADMIN') {
    return redirectTo(request, REDIRECT_WHEN_LOGGED_IN)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|fonts|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}

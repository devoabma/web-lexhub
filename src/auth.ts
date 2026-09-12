import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'

interface JWTTokenProps {
  sub: string
  role: 'ADMIN' | 'MEMBER'
}

export async function checkAdminStatus() {
  const cookieStore = await cookies()

  const token = cookieStore.get('@lexhub-auth')?.value

  if (!token) {
    return false
  }

  // Cookie malformado não derruba a página: é tratado como sem permissão
  try {
    const { role } = jwtDecode<JWTTokenProps>(token)

    return role === 'ADMIN'
  } catch {
    return false
  }
}

export async function getIsAgentAuthenticated() {
  const cookieStore = await cookies()

  const token = cookieStore.get('@lexhub-auth')?.value

  if (!token) {
    return false
  }

  // Cookie malformado não derruba a página: é tratado como não autenticado
  try {
    const { sub } = jwtDecode<JWTTokenProps>(token)

    return sub
  } catch {
    return false
  }
}

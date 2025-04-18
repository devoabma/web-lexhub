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

  const decodedToken: JWTTokenProps = jwtDecode(String(token))

  const role = decodedToken.role

  return role === 'ADMIN'
}

export async function getIsAgentAuthenticated() {
  const cookieStore = await cookies()

  const token = cookieStore.get('@lexhub-auth')?.value

  if (!token) {
    return false
  }

  const decodedToken: JWTTokenProps = jwtDecode(String(token))

  const { sub } = decodedToken

  return sub
}

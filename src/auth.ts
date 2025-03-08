import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'

interface JWTTokenProps {
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

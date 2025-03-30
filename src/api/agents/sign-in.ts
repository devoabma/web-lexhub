import { API } from '@/lib/axios'

interface SignInProps {
  email: string
  password: string
}

interface SignInResponse {
  token: string
}

export async function singIn({ email, password }: SignInProps) {
  const response = await API.post<SignInResponse>('/agents/sessions', {
    email,
    password,
  })

  return response.data
}

import { API } from '@/lib/axios'

interface SignInProps {
  email: string
  password: string
}

export async function singIn({ email, password }: SignInProps) {
  await API.post('/agents/sessions', {
    email,
    password,
  })
}

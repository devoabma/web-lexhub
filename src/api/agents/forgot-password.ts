import { API } from '@/lib/axios'

interface ForgotPasswordProps {
  email: string
}

export async function forgotPassword({ email }: ForgotPasswordProps) {
  await API.post<ForgotPasswordProps>('/agents/password/recover', {
    email,
  })
}

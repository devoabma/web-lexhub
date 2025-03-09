import { API } from '@/lib/axios'

interface ResetPasswordProps {
  code: string
  password: string
}

export async function resetPassword({ code, password }: ResetPasswordProps) {
  await API.post<ResetPasswordProps>('/agents/password/reset', {
    code,
    password,
  })
}

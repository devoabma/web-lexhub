import { API } from '@/lib/axios'

interface GetProfileProps {
  agent: {
    id: string
    name: string
    email: string
    role: 'ADMIN' | 'MEMBER'
  }
}

export async function getProfile() {
  const response = await API.get<GetProfileProps>('/agents/profile')

  return response.data
}

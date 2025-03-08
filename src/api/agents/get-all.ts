import { API } from '@/lib/axios'

interface GetAllProps {
  agents: {
    id: string
    name: string
    email: string
    role: 'ADMIN' | 'MEMBER'
    inactivedAt: string | null
  }[]
}

export async function getAll() {
  const response = await API.get<GetAllProps>('/agents/all')

  return response.data
}

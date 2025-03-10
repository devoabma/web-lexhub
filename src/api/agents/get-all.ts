import { API } from '@/lib/axios'

interface GetAllQuery {
  pageIndex?: number | null
}

interface GetAllProps {
  agents: {
    id: string
    name: string
    email: string
    role: 'ADMIN' | 'MEMBER'
    inactive: string | null
  }[]
  total: number
}

export async function getAll({ pageIndex }: GetAllQuery) {
  const response = await API.get<GetAllProps>('/agents/all', {
    params: {
      pageIndex,
    } as GetAllQuery,
  })

  return response.data
}

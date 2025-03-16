import { API } from '@/lib/axios'

interface GetAllQuery {
  pageIndex?: number | null
}

interface GetAllServicesProps {
  services: {
    id: string
    assistance: 'PERSONALLY' | 'REMOTE'
    observation: string | null
    status: 'OPEN' | 'COMPLETED'
    createdAt: string
    finishedAt: string | null
    lawyer: {
      id: string
      name: string
      cpf: string
      oab: string
      email: string
    }
    agent: {
      id: string
      name: string
      email: string
      role: 'ADMIN' | 'MEMBER'
    }
    serviceTypes: {
      serviceType: {
        id: string
        name: string
      }
    }[]
  }[]
  total: number
}

export async function getAllServices({ pageIndex }: GetAllQuery) {
  const response = await API.get<GetAllServicesProps>('/services/all', {
    params: {
      pageIndex,
    } as GetAllQuery,
  })

  return response.data
}

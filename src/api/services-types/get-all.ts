import { API } from '@/lib/axios'

interface GetAllQuery {
  pageIndex?: number | null
}

interface GetAllProps {
  servicesTypes: {
    id: string
    name: string
  }[]
  total: number
}

export async function getAll({ pageIndex }: GetAllQuery) {
  const response = await API.get<GetAllProps>('/services/types/all', {
    params: {
      pageIndex,
    } as GetAllQuery,
  })

  return response.data
}

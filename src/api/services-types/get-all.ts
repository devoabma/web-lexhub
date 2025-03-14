import { API } from '@/lib/axios'

interface GetAllQuery {
  pageIndex?: number | null
  id?: string | null
  name?: string | null
}

interface GetAllProps {
  servicesTypes: {
    id: string
    name: string
  }[]
  total: number
}

export async function getAll({ pageIndex, id, name }: GetAllQuery) {
  const response = await API.get<GetAllProps>('/services/types/all', {
    params: {
      pageIndex,
      id,
      name,
    },
  })

  return response.data
}

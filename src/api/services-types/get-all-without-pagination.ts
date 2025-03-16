import { API } from '@/lib/axios'

interface GetAllWithoutPaginationProps {
  servicesTypes: {
    id: string
    name: string
  }[]
}

export async function getAllWithoutPagination() {
  const response = await API.get<GetAllWithoutPaginationProps>(
    '/services/types/all-wp'
  )

  return response.data
}

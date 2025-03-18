import { API } from '@/lib/axios'

interface GetAllQuantityServicesMonth {
  totalCurrentMonth: number
  totalPreviousMonth: number
}

export async function getAllQuantityServicesMonth() {
  const response = await API.get<GetAllQuantityServicesMonth>(
    '/services/general/month'
  )

  return response.data
}

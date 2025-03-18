import { API } from '@/lib/axios'

interface GetAllQuantityServicesYear {
  totalCurrentYear: number
  totalPreviousYear: number
}

export async function getAllQuantityServicesYear() {
  const response = await API.get<GetAllQuantityServicesYear>(
    '/services/general/year'
  )

  return response.data
}

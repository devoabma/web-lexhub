import { API } from '@/lib/axios'

interface GetAllQuantityServicesResponse {
  total: number
}

export async function getAllQuantityServices() {
  const response =
    await API.get<GetAllQuantityServicesResponse>('/services/general')

  return response.data
}

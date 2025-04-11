import { API } from '@/lib/axios'

interface GetAllQuantityPerDayResponse {
  totalTheDay: number
  totalLastDay: number
}

export async function getAllQuantityPerDay() {
  const response = await API.get<GetAllQuantityPerDayResponse>(
    '/services/general/agent/day'
  )

  return response.data
}
